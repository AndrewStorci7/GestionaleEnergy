// Configuring .env file
require('dotenv').config();

const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse in JSON
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

app.listen(PORT, () => {
    console.log(`Server running on ${process.env.REACT_APP_URL}:${PORT}`);
})

