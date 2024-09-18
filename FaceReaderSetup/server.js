const express = require('express');
const bodyParser = require('body-parser');
const net = require('net');
const axios = require('axios');
const xmlparser = require('express-xml-bodyparser');
const cors = require('cors');
const { XMLParser } = require('fast-xml-parser');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const PORT = 5051; // Port for Node.js server
const FACE_READER_PORT = 9090; // Port where FaceReader is listening
const FACE_READER_HOST = '127.0.0.1'; // Address where FaceReader is running

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(bodyParser.json());
app.use(xmlparser());
app.use(cors({
    origin: 'http://localhost:3000' // Allow requests only from the frontend running on port 3000
}));

// WebSocket event handler
io.on('connection', (socket) => {
    console.log('A client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Function to format XML command
const formatXMLCommand = (typeName, xmlMessage) => {
    let xmlMessageBytes = Buffer.from(xmlMessage, 'utf8');
    let typeNameBytes = Buffer.from(typeName, 'utf8');

    let typeNameLength = typeNameBytes.length;
    let xmlMessageLength = xmlMessageBytes.length;

    let messageBytesLength = 4 + typeNameLength + xmlMessageLength;
    let packageBytesLength = messageBytesLength + 4;

    let packageBytes = Buffer.alloc(packageBytesLength);

    packageBytes.writeUInt32LE(packageBytesLength, 0);
    packageBytes.writeUInt32LE(typeNameLength, 4);
    typeNameBytes.copy(packageBytes, 8);
    xmlMessageBytes.copy(packageBytes, 8 + typeNameLength);

    return packageBytes;
}

// Function to convert XML to JSON
const convertXMLToJSON = (xmlData) => {
    const parser = new XMLParser();
    try {
        const json = parser.parse(xmlData);
        console.log("Converted JSON:", JSON.stringify(json, null, 2));
        return json;
    } catch (error) {
        console.error("Error converting XML to JSON:", error);
        throw error;
    }
};

const stressRelatedEmotions = ['Sad', 'Angry', 'Scared', 'Disgusted'];
let stressAccumulation = [];
let lastInterventionTime = 0;
const cooldownPeriod = 15 * 60 * 1000; // 15 minutes in milliseconds
const interventionThreshold = 5; // threshold for stress score
const pauseDuration = 3 * 60 * 1000; // 3 minutes in milliseconds

const processEmotionFrame = (jsonData) => {

    const state = jsonData?.Classification?.ClassificationValues?.ClassificationValue?.State?.string;
    const analysisStartTime = jsonData?.Classification?.AnalysisStartTime;
    const frameTimeTicks = jsonData?.Classification?.FrameTimeTicks;

    if (state && analysisStartTime && frameTimeTicks) {
        // Check if the state is a stress-related emotion
        if (stressRelatedEmotions.includes(state)) {
            stressAccumulation.push({
                State: state,
                AnalysisStartTime: analysisStartTime,
                FrameTimeTicks: frameTimeTicks
            });
        }
    }

    // Check if enough time has passed since the last intervention
    const currentTime = new Date().getTime();
    if (currentTime - lastInterventionTime >= cooldownPeriod) {
        analyzeStressAccumulation();
    }

    return stressAccumulation
}

// Function to analyze stress accumulation and trigger an intervention if necessary
function analyzeStressAccumulation() {
    const stressScore = stressAccumulation.length;

    if (stressScore >= interventionThreshold) {
        // Send event to React frontend which will send it to Furhat
        io.emit('furhatEvent', { message: 'Calming activity needed' });
        stressAccumulation = []; // Reset after intervention
        lastInterventionTime = new Date().getTime(); // Update the last intervention time
    }
}


// Function to send XML command to FaceReader and handle response
const sendXMLCommandToFaceReader = (typeName, xmlCommand, onData) => {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();

        client.connect(FACE_READER_PORT, FACE_READER_HOST, () => {
            console.log('Connected to FaceReader server.');
            const packageBytes = formatXMLCommand(typeName, xmlCommand);
            client.write(packageBytes, () => {
                console.log('Message sent to FaceReader');
            });
        });

        client.on('data', async (data) => {
            const receivedData = data.toString();

            if (onData) {
                onData(receivedData);
            }
            resolve(receivedData);
        });

        client.on('error', (err) => {
            console.error('Connection error:', err.message);
            reject(err);
        });

        client.on('end', () => {
            console.log('Connection ended.');
        });
    });
}

// API endpoint to start analyzing
app.post('/startAnalyzing', async (req, res) => {
    const startAnalyzingCommandXML = '<?xml version="1.0" encoding="utf-8"?>\n'
        + '<ActionMessage xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">\n'
        + '<Id>ID01</Id>\n'
        + '<ActionType>FaceReader_Start_Analyzing</ActionType>\n'
        + '</ActionMessage>\n';

    const startReceivingDetailedLogs = '<?xml version="1.0" encoding="utf-8"?>\n'
        + '<ActionMessage xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">\n'
        + '<Id>ID02</Id>\n'
        + '<ActionType>FaceReader_Start_StateLogSending</ActionType>\n'
        + '</ActionMessage>\n';

    const actionTypeName = 'FaceReaderAPI.Messages.ActionMessage';

    try {
        await sendXMLCommandToFaceReader(actionTypeName, startAnalyzingCommandXML);
        await sendXMLCommandToFaceReader(actionTypeName, startReceivingDetailedLogs, (xmlLogs) => {
            const json = convertXMLToJSON(xmlLogs);
            console.log(processEmotionFrame(json));
        });
        res.send('FaceReader started analyzing and getting detailed logs.');
    } catch (error) {
        res.status(500).send('Error starting FaceReader: ' + error.message);
    }
});

// API endpoint to stop analyzing
app.post('/stopAnalyzing', async (req, res) => {
    const stopAnalyzingCommandXML = '<?xml version="1.0" encoding="utf-8"?>\n'
        + '<ActionMessage xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">\n'
        + '<Id>ID03</Id>\n'
        + '<ActionType>FaceReader_Stop_Analyzing</ActionType>\n'
        + '</ActionMessage>\n';

    const stopReceivingDetailedLogs = '<?xml version="1.0" encoding="utf-8"?>\n'
        + '<ActionMessage xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">\n'
        + '<Id>ID04</Id>\n'
        + '<ActionType>FaceReader_Stop_StateLogSending</ActionType>\n'
        + '</ActionMessage>\n';

    const actionTypeName = 'FaceReaderAPI.Messages.ActionMessage';

    try {
        await sendXMLCommandToFaceReader(actionTypeName, stopAnalyzingCommandXML);
        await sendXMLCommandToFaceReader(actionTypeName, stopReceivingDetailedLogs);
        res.send('FaceReader stopped analyzing and stopped getting detailed logs.');
    } catch (error) {
        res.status(500).send('Error stopping FaceReader: ' + error.message);
    }
});

server.listen(PORT, () => {
    console.log(`Node.js server running on port ${PORT}`);
});