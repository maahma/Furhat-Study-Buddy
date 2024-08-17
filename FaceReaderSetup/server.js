const express = require('express');
const bodyParser = require('body-parser');
const net = require('net');
const axios = require('axios');

const app = express();
const PORT = 5050; // Port for your Node.js server
const FACE_READER_PORT = 9090; // Port where FaceReader is listening
const FACE_READER_HOST = '127.0.0.1'; // Address where FaceReader is running

// Middleware
app.use(bodyParser.json());

// TCP client to connect to FaceReader
const client = new net.Socket();

// Connect to FaceReader
client.connect(FACE_READER_PORT, FACE_READER_HOST, () => {
    console.log('Connected to FaceReader server.');

    // Example XML command to start analyzing
    const startAnalyzingCommand = `<?xml version="1.0" encoding="utf-8"?>
    <ActionMessage xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
        <Id>ID01</Id>
        <ActionType>FaceReader_Start_Analyzing</ActionType>
    </ActionMessage>`;

    console.log('Sending command to start analyzing.');
    client.write(startAnalyzingCommand + '\r\n'); // Ensure proper line ending
});

// Handle data received from FaceReader
client.on('data', (data) => {
    console.log('Received data from FaceReader:', data.toString());

    // Process and forward data to MERN app (e.g., React frontend via Express API)
    // axios.post('http://localhost:3000/faceReaderData', { data: data.toString() })
    //     .then(response => console.log('Data forwarded to MERN app:', response.data))
    //     .catch(err => console.error('Error forwarding data:', err));
});

// Handle connection end and errors
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

// Start the server
app.listen(PORT, () => {
    console.log(`Node.js server running on port ${PORT}`);
});