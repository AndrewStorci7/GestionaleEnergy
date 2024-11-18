/**
 * Express App Configuration
 * 
 * @author Andrea Storci from Oppimittinetworking
 */

// Configuring .env file
require('dotenv').config();

const express = require('express');
const db = require('./db');

const app = express();
const PORT = process.env.REACT_APP_SERVER_PORT || 3060;
const URL = process.env.REACT_APP_SERVER_URL || 'http://localhost';

// Middleware to parse in JSON
app.use(express.json());

app.get('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(`Username received: ${username}; \nPassword received: ${password}`);
        const [rows] = await db.query(`SELECT type, username, password FROM user WHERE username=${username} AND password=${password}`);
        if (rows) {
            res.json(rows)
        } else {
            res.json({ error: 1, message: "No user found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
    }
});

app.listen(PORT, () => {
    console.log(`Server running on ${URL}:${PORT}`);
})