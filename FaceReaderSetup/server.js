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
let startAnalyzingCommandXML = '<?xml version="1.0" encoding="utf-8"?>\n'
+ '<ActionMessage xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">\n'
+ '<Id>ID02</Id>\n'
+ '<ActionType>FaceReader_Start_Analyzing</ActionType>\n'
+ '</ActionMessage>\n';

const xmlMessageBytes = Buffer.from(startAnalyzingCommandXML, 'utf8');
const typeNameBytes = Buffer.from(typeName, 'utf8');

const typeNameLength = typeNameBytes.length;
const xmlMessageLength = xmlMessageBytes.length;

const messageBytesLength = 4 + typeNameLength + xmlMessageLength;
const packageBytesLength = messageBytesLength + 4;

const packageBytes = Buffer.alloc(packageBytesLength);

packageBytes.writeUInt32LE(packageBytesLength, 0);
packageBytes.writeUInt32LE(typeNameLength, 4);
typeNameBytes.copy(packageBytes, 8);
xmlMessageBytes.copy(packageBytes, 8 + typeNameLength);

// Connect to FaceReader
client.connect(FACE_READER_PORT, FACE_READER_HOST, () => {
    console.log('Connected to FaceReader server.');
    client.write(packageBytes, () => {
        console.log('Message sent to FaceReader');
        client.end();
    });
});

// Handle data received from FaceReader
client.on('data', (data) => {
    console.log('Received data from FaceReader:', data.toString());
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