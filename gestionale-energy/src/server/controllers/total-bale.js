const Console = require('../inc/console')
const Common = require('./main/common')
const PresserBale = require('./presser')
const WheelmanBale = require('./wheelman')

const axios = require('axios')

const console = new Console("TotalBale")

/**
 * 
 */
class TotalBale extends Common {

    constructor(db, id, idPB, idWB, implant) {
        super(db, id)
        this.idPB = idPB;
        this.idWB = idWB;
        this.implant = implant;
        this.internalUrl = `${process.env.NEXT_PUBLIC_APP_SERVER_URL}:${process.env.NEXT_PUBLIC_APP_SERVER_PORT}` 
        // this.presserbale = new PresserBale(db)
    }

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
    async add(req, res) {
        try {
            const { data } = req.body;
            const id_implant = data.id_implant;
            const id_presser = data.id_presser;
            
            console.info(`Data (Presser Bale) received: ${id_presser}, ${id_implant}`);
            
            const check_ins_pb = await this.db.query(
                "INSERT INTO presser_bale(id_presser) VALUES (?)",
                [id_presser]
            );
            const check_ins_wb = await this.db.query(
                `INSERT INTO wheelman_bale() VALUES ()`
            );
    
            if (check_ins_pb && check_ins_wb) {
                
                const [rows_pb] = await this.db.query("SELECT id FROM presser_bale ORDER BY id DESC LIMIT 1");
    
                const [rows_wb] = await this.db.query("SELECT id FROM wheelman_bale ORDER BY id DESC LIMIT 1");
    
                const check_ins_pbwb = await this.db.query(
                    "INSERT INTO pb_wb VALUES(?, ?, ?)",
                    [rows_pb[0].id, rows_wb[0].id, id_implant]
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
    }

    /**
     * Get a total of bale as the format
     */
    async get(req, res) {
        try {
            const { id_implant } = req.body;
    
            console.info(`body received: ${id_implant}`)

            const presserResult = [];
            const wheelmanResult = [];
            const turn = super.checkTurn();

            const [select] = await this.db.query(
                "SELECT pb_wb.id_pb, pb_wb.id_wb FROM pb_wb JOIN presser_bale JOIN wheelman_bale JOIN implants " + 
                "ON pb_wb.id_pb = presser_bale.id AND " +
                "pb_wb.id_wb = wheelman_bale.id AND " +
                "pb_wb.id_implant = implants.id " +
                "WHERE pb_wb.id_implant = ? " +
                "AND DATE(presser_bale.data_ins) = CURDATE() " +
                "AND DATE(wheelman_bale.data_ins) = CURDATE() " +
                "AND TIME(presser_bale.data_ins) BETWEEN ? AND ? " +
                "AND TIME(wheelman_bale.data_ins) BETWEEN ? AND ? ORDER BY TIME(presser_bale.data_ins) DESC, TIME(wheelman_bale.data_ins) DESC LIMIT 100 ",
                [id_implant, turn[0], turn[1], turn[0], turn[1]]
            );

            console.info(select)

            if (select !== 'undefined' || select !== null) {

                for (const e of select) {

                    var id_presser = e.id_pb
                    var id_wheelman = e.id_wb
                    const [res_presser] = await fetch(this.internalUrl + '/presser', { 
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ id: id_presser })
                    }).then(res => res.json())
                    // res_presser = await res_presser.json();
                    const [res_wheelman] = await fetch(this.internalUrl + '/wheelman', { 
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ id: id_wheelman })
                    }).then(res => res.json())
                    // res_wheelman = await res_wheelman.json();

                    console.info("Content presser: ")
                    console.info(res_presser)
                    console.info("Content wheelman: ")
                    console.info(res_wheelman)
                    presserResult.push(res_presser)
                    wheelmanResult.push(res_wheelman)
                };
            }
            
            console.info("prova")
            console.info(presserResult)
            console.info(wheelmanResult)

            if ((presserResult && presserResult.length > 0) && (wheelmanResult && wheelmanResult.length > 0)) {
                res.json({ code: 0, presser: presserResult, wheelman: wheelmanResult })
            } else {
                res.json({ code: 1, message: "Nessuna balla trovata" })
            }
            
        } catch (error) {
            console.error(error)
            res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
        }
    }

    /**
     * Get all bale grouped by turn and implant
     */
    async getAllWheelmanBale(req, res, returnResult = false) {
        try {
            const { body } = req.body;
            const id_implant = body.id_implant;
            const turn = super.checkTurn();

            const [select] = await this.db.query(
`SELECT
cond_wheelman_bale.type AS 'condition',
reas_not_tying.name AS 'reason',
wheelman_bale.weight AS 'weight',
warehouse_dest.name AS 'warehouse',
wheelman_bale.note AS 'notes',
wheelman_bale.printed AS 'is_printed',
wheelman_bale.data_ins AS 'data_ins'
FROM pb_wb JOIN presser_bale JOIN wheelman_bale JOIN implants JOIN reas_not_tying JOIN cond_wheelman_bale JOIN warehouse_dest
ON pb_wb.id_pb = presser_bale.id AND
pb_wb.id_wb = wheelman_bale.id AND
pb_wb.id_implant = implants.id AND
wheelman_bale.id_cwb = cond_wheelman_bale.id AND
wheelman_bale.id_rnt = reas_not_tying.id AND
wheelman_bale.id_wd = warehouse_dest.id
WHERE implants.id = ${id_implant}
AND DATE(wheelman_bale.data_ins) = CURDATE()
AND TIME(wheelman_bale.data_ins) ${turn} LIMIT 100;`
            );

            console.info(select)

        } catch (error) {
            console.error(error)
            res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
        }
    }

    /**
     * Get all bale grouped by turn and implant
     */
    async getAllPresserBale(req, res, returnResult = false) {
        try {
            const { body } = req.body;
            const id_implant = body.id_implant;
            const turn = super.checkTurn();

            const [select] = await this.db.query(
`SELECT
code_plastic.code AS 'plastic',
code_plastic.desc AS 'code',
rei.name AS 'rei',
cond_presser_bale.type AS 'condition',
selected_bale.name AS 'selected_bale',
presser_bale.note AS 'notes',
presser_bale.data_ins AS 'data_ins'
FROM pb_wb JOIN presser_bale JOIN wheelman_bale JOIN implants JOIN code_plastic JOIN cond_presser_bale JOIN rei JOIN selected_bale
ON pb_wb.id_pb = presser_bale.id AND
pb_wb.id_wb = wheelman_bale.id AND
pb_wb.id_implant = implants.id AND
presser_bale.id_plastic = code_plastic.code AND
presser_bale.id_presser = user.id AND
presser_bale.id_rei = rei.id AND
presser_bale.id_sb = selected_bale.id
WHERE implants.id = ${id_implant}
AND DATE(wheelman_bale.data_ins) = CURDATE()
AND TIME(wheelman_bale.data_ins) ${turn} LIMIT 100;`
            );

            console.info(select)

        } catch (error) {
            console.error(error)
            res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
        }
    }
}

module.exports = TotalBale