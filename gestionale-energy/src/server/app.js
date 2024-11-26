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

const handlePresserData = async (req, res) => {
    const { id_user } = req.body;
    console.log(`Id Presser received: ${id_user}\n`)
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
        WHERE user.id = ${id_user} LIMIT 100`
    )

    if (rows && rows.length > 0) {
        // const json_resp = JSON.stringify({code: 0, data: rows});
        console.log(`Content Presser from DB: ${JSON.stringify(rows)}`)
        // res.json({code: 0, data: rows})
        return { code: 0, rows }
    } else {
        console.log(JSON.stringify({ code: 1, message: "Nessuna balla trovata" }))
        // res.json({ code: 1, message: "Nessuna balla trovata" });
        return { code: 1, message: "Nessuna balla trovata" }
    }
};

const handleWheelmanData = async (req, res) => {
    const { id_user } = req.body;
    console.log(`Id Wheelman received: ${id_user}\n`);
    const [rows] = await db.query(
        `SELECT 
        cond_wheelman_bale.type AS 'condition', 
        reas_not_tying.name AS 'reason',
        wheelman_bale.weight AS 'weight',
        warehouse_dest.name AS 'warehouse',
        wheelman_bale.note AS 'notes',
        wheelman_bale.printed AS 'is_printed',
        wheelman_bale.data_ins AS 'data_ins'
        FROM wheelman_bale JOIN reas_not_tying JOIN cond_wheelman_bale JOIN warehouse_dest JOIN user
        ON wheelman_bale.id_wheelman = user.id AND
        wheelman_bale.id_cwb = cond_wheelman_bale.id AND
        wheelman_bale.id_rnt = reas_not_tying.id AND
        wheelman_bale.id_wd = warehouse_dest.id
        WHERE wheelman_bale.id_wheelman = ${id_user} LIMIT 100`
    );

    if (rows && rows.length > 0) {
        console.log(`Content Wheelman from DB: ${JSON.stringify(rows)}`)
        // res.json(rows)
        return { code: 0, rows }
    } else {
        console.log(JSON.stringify({ code: 1, message: "Nessuna balla trovata" }))
        return { code: 1, message: "Nessuna balla trovata" }
    }
};

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
        console.error(error);
        res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
    }
});

/**
 * Wheelman route
 */
app.post('/wheelman', async (req, res) => {
    try {
        const data = await handleWheelmanData(req, res);
        
        console.log(data)
        
        if (data.code !== 0) {
            res.json(data)
        } else {
            res.json({ code: 0, data: data.rows })
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
    }
});

/**
 * Presser route
 */
app.post('/presser', async (req, res) => {
    try {
        const data = await handlePresserData(req, res);
        
        console.log(data)

        if (data.code !== 0) {
            res.json(data)
        } else {
            res.json({ code: 0, data: data.rows })
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
    }
});

/**
 * Bale route
 */
app.post('/bale', async (req, res) => {
    try {
        const data_presser = await handlePresserData(req, res);
        const data_wheelman = await handleWheelmanData(req, res);
        res.json({ code: 0, data_presser, data_wheelman })
    } catch (error) {
        console.error(error);
        res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
    }
});

/**
 * Add Bale on DB
 */
app.post('/add-bale', async (req, res) =>  {
    try {
        const { data } = req.body;
        console.log(`Data (Presser Bale) received: ${data}`);
        const check_ins_pb = await db.query(
            // `INSERT INTO presser_bale(id_presser, id_plastic, id_rei, id_cpb, id_sb, note) 
            // VALUES (${data.id_presser}, ${(data.id_plastic !== null) ? '\'NULL\'' : data.id_plastic}, ${(data.id_rei !== null) ? '\'NULL\'' : data.id_rei}, ${(data.id_cpb !== null) ? '\'NULL\'' : data.id_cpb}, ${(data.id_sb !== null) ? '\'NULL\'' : data.id_sb}, '${data.note}')`
            `INSERT INTO presser_bale(id_presser, id_plastic, id_rei, id_cpb, id_sb, note) 
            VALUES ('${data.id_presser}', ${(data.id_plastic === null) ? 'NULL' : data.id_plastic}, ${(data.id_rei === null) ? 'NULL' : data.id_rei}, ${(data.id_cpb === null) ? 'NULL' : data.id_cpb}, ${(data.id_sb === null) ? 'NULL' : data.id_sb}, '${data.note}')`
        );

        if (check_ins_pb) {
            // TODO insert into pb_wb
            const [rows] = await db.query(
                "SELECT id FROM presser_bale ORDER BY id DESC LIMIT 1"
            );

            console.log(rows)

        } else {
            res.json({ code: 1, message: 'Errore nell\'inserimento' })
        }

    } catch (error) {
        console.error(error)
        res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
    }
});



app.listen(PORT, () => {
    console.log(`Server running on ${URL}:${PORT}`);
});