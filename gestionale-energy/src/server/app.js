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
        WHERE TIME(presser_bale.data_ins) LIMIT 100`
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
 * 
 * @param {json} req    { data: 
 *                          {  
 *                              id_implant: [int] id dell'impianto
 *                              id_presser: [int] id dell'utente
 *                          } 
 *                      }
 */
app.post('/add-bale', async (req, res) =>  {
    try {
        const { data } = req.body;
        const id_implant = data.id_implant;
        const id_presser = data.id_presser;
        
        console.log(`Data (Presser Bale) received: ${id_presser}, ${id_implant}`);
        
        const check_ins_pb = await db.query(
            `INSERT INTO presser_bale(id_presser) VALUES (${id_presser})`
        );
        const check_ins_wb = await db.query(
            `INSERT INTO wheelman_bale() VALUES ()`
        );

        if (check_ins_pb && check_ins_wb) {
            
            const [rows_pb] = await db.query("SELECT id FROM presser_bale ORDER BY id DESC LIMIT 1");

            const [rows_wb] = await db.query("SELECT id FROM wheelman_bale ORDER BY id DESC LIMIT 1");

            const check_ins_pbwb = await db.query(
                `INSERT INTO pb_wb VALUES(${rows_pb[0].id}, ${rows_wb[0].id}, ${id_implant})`
            );

            if (check_ins_pbwb) {
                res.json({ code: 0, data: { id_presser_bale: rows_pb[0].id, id_wheelman_bale: rows_wb[0].id }})
            } else {
                res.json({ code: 1, message: "Errore nell'inserimento di una nuova balla" })
            }

        } else {
            res.json({ code: 1, message: 'Errore nell\'inserimento' })
        }

    } catch (error) {
        console.error(error)
        res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
    }
});


/**
 * Select plastic data
 */
app.get('/plastic', async (req, res) => {
    try {
        const [select] = await db.query(
            "SELECT code_plastic.code AS code, code_plastic.type AS plastic_type, code_plastic.desc FROM code_plastic"
        );

        if (select && select.length > 0) {
            console.log(`Type of plastic from DB: \n\t${JSON.stringify(select)}`)
            res.json({ code: 0, data: select })
        } else {
            res.json({ code: 1, message: "No data fetched" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
    }
});


/**
 * Condition Wheelman Bale data
 */
app.get('/cdbc', async (req, res) => {
    try {
        const [select] = await db.query(
            "SELECT * FROM cond_presser_bale"
        );

        if (select && select.length > 0) {
            console.log(`Type of condition presser bale from DB: \n\t${JSON.stringify(select)}`)
            res.json({ code: 0, data: select })
        } else {
            res.json({ code: 1, message: "No data fetched" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
    }
});


/**
 * Condition Presser Bale route
 */
app.get('/cdbp', async (req, res) => {
    try {
        const [select] = await db.query(
            "SELECT * FROM cond_wheelman_bale"
        );

        if (select && select.length > 0) {
            console.log(`Type of condition wheelman bale from DB: \n\t${JSON.stringify(select)}`)
            res.json({ code: 0, data: select })
        } else {
            res.json({ code: 1, message: "No data fetched" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
    }
});


/**
 * Warehouse Destination route
 */
app.get('/dest-wh', async (req, res) => {
    try {
        const [select] = await db.query(
            "SELECT * FROM warehouse_dest"
        );

        if (select && select.length > 0) {
            console.log(`Type of warehouse destination from DB: \n\t${JSON.stringify(select)}`)
            res.json({ code: 0, data: select })
        } else {
            res.json({ code: 1, message: "No data fetched" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
    }
});

/**
 * REI route
 */
app.get('/rei', async (req, res) => {
    try {
        const [select] = await db.query(
            "SELECT * FROM rei"
        );

        if (select && select.length > 0) {
            console.log(`Type of rei from DB: \n\t${JSON.stringify(select)}`)
            res.json({ code: 0, data: select })
        } else {
            res.json({ code: 1, message: "No data fetched" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
    }
});

/**
 * Selected Bale route
 */
app.get('/selected-b', async (req, res) => {
    try {
        const [select] = await db.query(
            "SELECT * FROM selected_bale"
        );

        if (select && select.length > 0) {
            console.log(`Type of selected bale from DB: \n\t${JSON.stringify(select)}`)
            res.json({ code: 0, data: select })
        } else {
            res.json({ code: 1, message: "No data fetched" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
    }
});

/**
 * Selected Bale route
 */
app.get('/reason', async (req, res) => {
    try {
        const [select] = await db.query(
            "SELECT * FROM selected_bale"
        );

        if (select && select.length > 0) {
            console.log(`Type of selected bale from DB: \n\t${JSON.stringify(select)}`)
            res.json({ code: 0, data: select })
        } else {
            res.json({ code: 1, message: "No data fetched" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
    }
});

/**
 * Implants route
 */
app.get('/implants', async (req, res) =>  {
    try {
        const [select] = await db.query(
            "SELECT * FROM implants"
        );

        if (select && select.length > 0) {
            console.log(`Type of implants from DB: \n\t${JSON.stringify(select)}`)
            res.json({ code: 0, data: select })
        } else {
            res.json({ code: 1, message: "No data fetched" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
    }
});

/**
 * Update presser bale
 */
app.post('/upresserbale', async (req, res) => {
    try {
        const { body } = req.body;
        
        console.log(body);
        console.log(body.id_user);

        const [check] = await db.query(
            `UPDATE presser_bale 
            SET id_presser=${body.id_user}, id_plastic='${body.id_plastic}', id_rei=${body.id_rei}, id_cpb=${body.id_cpb}, id_sb=${body.id_sb}, note='${body.note}', data_ins=NOW()`
        );

        if (check) {
            res.json({ code: 0 })
        } else {
            res.json({ code: 1, message: "Errore nella modifica di una balla" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
    }
})

app.post('/uwheelmanbale', async (req, res) => {
    try {
        const { body } = req.body;

        const [check] = await db.query(
            `UPDATE wheelman_bale 
            SET id_wheelman=${body.id_user}, id_cwb=${body.id_cwb}, id_rnt=${body.id_rnt}, id_wd=${body.id_wd}, note='${body.note}', printed=${body.isPrinted}, data_ins=NOW(), weigth=${body.weight}`
        );

        if (check) {
            res.json({ code: 0 });
        } else {
            res.json({ code: 1, message: "Errore nella modifica di una balla" });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
    }
})

app.listen(PORT, () => {
    console.log(`Server running on ${URL}:${PORT}`);
});