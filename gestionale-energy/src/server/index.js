// Configuring .env file
require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.REACT_APP_SERVER_PORT || 3060;
const URL = process.env.REACT_APP_SERVER_URL || 'http://localhost';

// Middleware to parse in JSON
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

app.listen(PORT, () => {
    console.log(`Server running on ${URL}:${PORT}`);
})

