const express = require('express');
const bodyParser = require('body-parser');
const net = require('net');
const axios = require('axios');
const xmlparser = require('express-xml-bodyparser');

const app = express();
const PORT = 5050; // Port for your Node.js server
const FACE_READER_PORT = 9090; // Port where FaceReader is listening
const FACE_READER_HOST = '127.0.0.1'; // Address where FaceReader is running

// Middleware
app.use(bodyParser.json());
app.use(xmlparser());

// TCP client to connect to FaceReader
const client = new net.Socket();

// Define the message type name
const typeName = 'FaceReaderAPI.Messages.ActionMessage';

// let startAnalyzingCommandXML = '<?xml version="1.0" encoding="utf-8"?>\n'
//     startAnalyzingCommandXML += '<ActionMessage xmlns:xsi="http://www.w3.org/2001/'
//     startAnalyzingCommandXML += 'XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">\n'
//     startAnalyzingCommandXML += '<Id>ID01</Id>\n'
//     startAnalyzingCommandXML += '<ActionType>FaceReader_Start_Analyzing</ActionType>\n'
//     startAnalyzingCommandXML += '</ActionMessage>\n'


let startAnalyzingCommandXML = '<?xml version="1.0" encoding="utf-8"?>\n'
+ '<ActionMessage xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">\n'
+ '<Id>ID02</Id>\n'
+ '<ActionType>FaceReader_Start_Analyzing</ActionType>\n'
+ '</ActionMessage>\n';

let typeNameLength;
let packageLength;

// Connect to FaceReader
client.connect(FACE_READER_PORT, FACE_READER_HOST, () => {
    console.log('Connected to FaceReader server.');

    // Convert to utf-8 bytes
    const xmlMessageBytes = Buffer.from(startAnalyzingCommandXML, 'utf8');
    const typeNameBytes = Buffer.from(typeName, 'utf8');
    
    // Length
    const xmlMessageLength = xmlMessageBytes.length;
    typeNameLength = typeNameBytes.length;

    // Complete message length 
    const messageBytesLength = typeNameLength + xmlMessageLength;
    packageLength = messageBytesLength + 4;

    // Create the full message buffer
    const packageBuffer = Buffer.alloc(packageLength);

    // Write the length prefix (total length of the package, including this 4-byte prefix)
    packageBuffer.writeUInt32BE(packageLength, 0);

    // Write the type name bytes
    typeNameBytes.copy(packageBuffer, 4);

    // Write the XML message bytes
    xmlMessageBytes.copy(packageBuffer, 4 + typeNameLength);

    client.write(packageBuffer);
    console.log('Message sent to FaceReader.');

    // DEBUG
    console.log("DEBUGGING")
    console.log('Sent Package Buffer:', packageBuffer);
    console.log('Package Buffer Length:', packageBuffer.length);
    const extractedTypeName = packageBuffer.slice(4, 4 + typeNameLength).toString('utf8');
    console.log('Extracted Type Name:', extractedTypeName);
    const extractedXmlMessage = xmlMessageBytes.toString('utf8');
    console.log('Extracted XML Message:', extractedXmlMessage);
});

// Handle data received from FaceReader
client.on('data', (data) => {
    console.log('Received data from FaceReader:', data.toString());

    // DEBUGGING
    console.log('Received data from FaceReader:', data);

    const receivedLengthPrefix = data.readUInt32BE(0);
    console.log('Received Length Prefix:', receivedLengthPrefix);

    // Ensure that we are slicing the correct amount of bytes
    const receivedTypeName = data.slice(4, 4 + typeNameLength).toString('utf8');
    console.log('Received Type Name:', receivedTypeName);

    const receivedXmlMessage = data.slice(4 + typeNameLength).toString('utf8');
    console.log('Received XML Message:', receivedXmlMessage);

    // Verify if the received length matches the expected length
    if (receivedLengthPrefix === packageLength) {
        console.log('Package length is correct.');
    } else {
        console.log('Package length is incorrect.');
    }

    // Process and forward data to MERN app (e.g., React frontend via Express API)
    // axios.post('http://localhost:3000/faceReaderData', { data: data.toString() })
    //     .then(response => console.log('Data forwarded to MERN app:', response.data))
    //     .catch(err => console.error('Error forwarding data:', err));
});

client.on('end', () => {
    console.log('Connection ended.');
});

client.on('error', (err) => {
    console.error('Connection error:', err.message);
});

// Define an endpoint to receive data from FaceReader
// app.post('/faceReaderData', (req, res) => {
//     console.log('Data received in MERN app:', req.body);
//     // Here you can forward this data to MongoDB or process it as needed
//     res.send('Data received');
// });

app.listen(PORT, () => {
    console.log(`Node.js server running on port ${PORT}`);
});