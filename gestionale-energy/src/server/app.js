/**
 * Express App Configuration
 * 
 * @author Andrea Storci from Oppimittinetworking
 */

// Configuring .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.NEXT_PUBLIC_APP_SERVER_PORT;
const URL = process.env.NEXT_PUBLIC_APP_SERVER_URL;

// Middleware to parse in JSON
app.use(express.json());
// Allow CORS
app.use(cors());

/**
 * Login route
 */
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(`Username received: ${username}; \nPassword received: ${password}`);
        const [rows] = await db.query(`SELECT type, username, name, surname FROM user WHERE user.username='${username}' AND user.password='${password}'`);
        if (rows && rows.length > 0) {
            console.log(JSON.stringify(rows))
            res.json(rows)
        } else {
            console.log(JSON.stringify({ code: 1, message: "Credenziali errate" }))
            res.json({ code: 1, message: "Credenziali errate" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
    }
});

app.listen(PORT, () => {
    console.log(`Server running on ${URL}:${PORT}`);
})