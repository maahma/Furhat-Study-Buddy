const express = require('express');
const bodyParser = require('body-parser');
const net = require('net');
const axios = require('axios');
const xmlparser = require('express-xml-bodyparser');
const cors = require('cors');

const app = express();
const PORT = 5051; // Port for Node.js server
const FACE_READER_PORT = 9090; // Port where FaceReader is listening
const FACE_READER_HOST = '127.0.0.1'; // Address where FaceReader is running

// Middleware
app.use(bodyParser.json());
app.use(xmlparser());

app.use(cors({
    origin: 'http://localhost:3000' // Allow requests only from the frontend running on port 3000
}));


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

        client.on('data', (data) => {
            const receivedData = data.toString();
            console.log("Received data from FaceReader")
            console.log(receivedData)

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
        + '<ActionType>FaceReader_Start_DetailedLogSending</ActionType>\n'
        + '</ActionMessage>\n';

    const actionTypeName = 'FaceReaderAPI.Messages.ActionMessage';

    try {
        await sendXMLCommandToFaceReader(actionTypeName, startAnalyzingCommandXML);
        await sendXMLCommandToFaceReader(actionTypeName, startReceivingDetailedLogs, (log) => {
            console.log('Detailed log received:', log);
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
        + '<ActionType>FaceReader_Stop_DetailedLogSending</ActionType>\n'
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

app.listen(PORT, () => {
    console.log(`Node.js server running on port ${PORT}`);
});










//////////////////////// WORKING FINE ///////////////////////////////////
// Define the message type name
// const typeName = 'FaceReaderAPI.Messages.ActionMessage';
// let startAnalyzingCommandXML = '<?xml version="1.0" encoding="utf-8"?>\n'
// + '<ActionMessage xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">\n'
// + '<Id>ID02</Id>\n'
// + '<ActionType>FaceReader_Start_Analyzing</ActionType>\n'
// + '</ActionMessage>\n';

// const xmlMessageBytes = Buffer.from(startAnalyzingCommandXML, 'utf8');
// const typeNameBytes = Buffer.from(typeName, 'utf8');

// const typeNameLength = typeNameBytes.length;
// const xmlMessageLength = xmlMessageBytes.length;

// const messageBytesLength = 4 + typeNameLength + xmlMessageLength;
// const packageBytesLength = messageBytesLength + 4;

// const packageBytes = Buffer.alloc(packageBytesLength);

// packageBytes.writeUInt32LE(packageBytesLength, 0);
// packageBytes.writeUInt32LE(typeNameLength, 4);
// typeNameBytes.copy(packageBytes, 8);
// xmlMessageBytes.copy(packageBytes, 8 + typeNameLength);

// Connect to FaceReader
// client.connect(FACE_READER_PORT, FACE_READER_HOST, () => {
//     console.log('Connected to FaceReader server.');

//     let packageBytes = formatXMLCommand(typeName, startAnalyzingCommandXML)
//     client.write(packageBytes, () => {
//         console.log('Message sent to FaceReader');
//         client.end();
//     });
// });

// // Handle data received from FaceReader
// client.on('data', (data) => {
//     console.log('Received data from FaceReader:', data.toString());
// });

// client.on('end', () => {
//     console.log('Connection ended.');
// });

// client.on('error', (err) => {
//     console.error('Connection error:', err.message);
// });

// app.listen(PORT, () => {
//     console.log(`Node.js server running on port ${PORT}`);
// });
//////////////////////// WORKING FINE ///////////////////////////////////