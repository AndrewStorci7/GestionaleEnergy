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
        console.log(`Username received: ${username}; \nPassword received: ${password}\n`);
        const [rows] = await db.query(`SELECT * FROM user WHERE user.username='${username}' AND user.password='${password}'`);
        if (rows && rows.length > 0) {
            console.log(JSON.stringify(rows[0]))
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

/**
 * Wheelman route
 */
app.post('/wheelman', async (req, res) => {
    try {
        const id_user = req.body;
        console.log(`Id received: ${id_user}\n`);
        const [rows] = await db.query(
`SELECT 
cond_wheelman_bale.type AS 'condition', 
reas_not_tying.name AS 'reason',
wheelman_bale.weigth AS 'weigth',
warehouse_dest.name AS 'warehouse',
wheelman_bale.note AS 'notes',
wheelman_bale.printed AS 'is_printed',
wheelman_bale.data_ins AS 'data_ins'
FROM wheelman_bale JOIN reas_not_tying JOIN cond_wheelman_bale JOIN warehouse_dest JOIN user
ON wheelman_bale.id_wheelman = user.id AND
wheelman_bale.id_cwb = cond_wheelman_bale.id AND
wheelman_bale.id_rnt = reas_not_tying.id AND
wheelman_bale.id_wd = warehouse_dest.id
WHERE wheelman_bale.id_wheelman = ${id_user}`
        );

        if (rows && rows.length > 0) {
            console.log(JSON.stringify(rows))
            res.json(rows)
        } else {
            console.log(JSON.stringify({ code: 1, message: "Nessuna balla trovata" }))
            res.json({ code: 1, message: "Nessuna balla trovata" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
    }
});

/**
 * Presser route
 */
app.post('/presser', async (req, res) => {
    try {
        const id_user = req.body;
        console.log(`Id received: ${id_user}\n`);
        const [rows] = await db.query(
`SELECT
code_plastic.code AS 'plastic',
code_plastic.desc AS 'code',
rei.name AS 'rei',
cond_presser_bale.type AS 'condition',
selected_bale.name AS 'selected_bale',
presser_bale.note AS 'notes',
presser_bale.data_ins AS 'data_ins'
FROM presser_bale JOIN code_plastic JOIN cond_presser_bale JOIN rei JOIN selected_bale JOIN user
ON presser_bale.id_cpb = cond_presser_bale.id AND
presser_bale.id_plastic = code_plastic.code AND
presser_bale.id_presser = user.id AND
presser_bale.id_rei = rei.id AND
presser_bale.id_sb = selected_bale.id
WHERE user.id = ${id_user}`
        );

        if (rows && rows.length > 0) {
            console.log(JSON.stringify(rows))
            res.json(rows)
        } else {
            console.log(JSON.stringify({ code: 1, message: "Nessuna balla trovata" }))
            res.json({ code: 1, message: "Nessuna balla trovata" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
    }
});

/**
 * Bale route
 */
app.post('/bale', async (req, res) => {

});

app.listen(PORT, () => {
    console.log(`Server running on ${URL}:${PORT}`);
});