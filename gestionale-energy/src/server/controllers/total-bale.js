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

    constructor(db, table, id) {
        super(db, table, id)
        // this.idPB = idPB;
        // this.idWB = idWB;
        // this.implant = implant;
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

            console.info(data)

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
                    `INSERT INTO ${this.table} VALUES(?, ?, ?)`,
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
     * Get a total bale composed by information of the bale created by presser
     * and the information of the bale added by wheelman
     * 
     * @param {object} req
     * @param {object} res
     */
    async get(req, res) {
        try {
            const { id_implant } = req.body;
    
            console.info(`body received: ${id_implant}`)

            const presserResult = [];
            const wheelmanResult = [];
            const turn = super.checkTurn();

            const [select] = await this.db.query(
                `SELECT ${this.table}.id_pb, ${this.table}.id_wb FROM ${this.table} JOIN presser_bale JOIN wheelman_bale JOIN implants 
                ON ${this.table}.id_pb = presser_bale.id AND
                ${this.table}.id_wb = wheelman_bale.id AND
                ${this.table}.id_implant = implants.id
                WHERE ${this.table}.id_implant = ?
                AND DATE(presser_bale.data_ins) = CURDATE()
                AND DATE(wheelman_bale.data_ins) = CURDATE()
                AND TIME(presser_bale.data_ins) BETWEEN ? AND ?
                AND TIME(wheelman_bale.data_ins) BETWEEN ? AND ? ORDER BY TIME(presser_bale.data_ins) DESC, TIME(wheelman_bale.data_ins) DESC LIMIT 100 `,
                [id_implant, turn[0], turn[1], turn[0], turn[1]]
            );

            if (select !== 'undefined' || select !== null) {

                for (const e of select) {

                    var id_presser = e.id_pb
                    var id_wheelman = e.id_wb
                    const [res_presser] = await fetch(this.internalUrl + '/presser', { 
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ id: id_presser })
                    }).then(res => res.json())

                    const [res_wheelman] = await fetch(this.internalUrl + '/wheelman', { 
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ id: id_wheelman })
                    }).then(res => res.json())

                    presserResult.push(res_presser)
                    wheelmanResult.push(res_wheelman)
                };
            }

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
     * Get all bale 
     * 
     * @param {object} req
     * @param {object} res
     */    
    async getByImplantId(req, res) {
        try {
            const { id_implant } = req.body;
        
            console.info(`Filtrato dal ID Impianto: ${id_implant}`);
        
            const [select] = await this.db.query(
                `SELECT
                    ${this.table}.id_pb, ${this.table}.id_wb, 
                    presser_bale.data_ins AS presser_data, 
                    wheelman_bale.data_ins AS wheelman_data
                FROM ${this.table} JOIN presser_bale JOIN wheelman_bale JOIN implants 
                ON ${this.table}.id_pb = presser_bale.id 
                AND ${this.table}.id_wb = wheelman_bale.id 
                AND ${this.table}.id_implant = implants.id
                WHERE ${this.table}.id_implant = ? ORDER BY presser_bale.data_ins DESC LIMIT 100`,
                [id_implant]
            );
        
            if (select && select.length > 0) {
                
                const presserResult = [];
                const wheelmanResult = [];
        
                for (const e of select) {
                    var id_presser = e.id_pb;
                    var id_wheelman = e.id_wb;
        
                    
                    const [res_presser] = await fetch(this.internalUrl + '/presser', { 
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ id: id_presser })
                    }).then(res => res.json());
        
                    const [res_wheelman] = await fetch(this.internalUrl + '/wheelman', { 
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ id: id_wheelman })
                    }).then(res => res.json());
        
                    presserResult.push(res_presser);
                    wheelmanResult.push(res_wheelman);
                }
        
                res.json({ code: 0, presser: presserResult, wheelman: wheelmanResult });
            } else {
                res.json({ code: 1, message: "Nessuna Balla Trovata." });
            }
        
        } catch (error) {
            console.error(error);
            res.status(500).send(`Errore durante l'esecuzione della query: ${error}`);
        }
    }

    getIdsBale = async (id) => {
        const [select] = await this.db.query(
            `SELECT * FROM ${this.table} WHERE id_pb=?`,
            [id]
        )

        if (select) {
            return select
        } else {
            throw new Error("Errore durante la selezione della balla")
        }
    }

    /**
     * Delete a multiple bales from ids
     * 
     * @param {object} req 
     * @param {object} res 
     */
    async delete(req, res) {
        try {
            const {id_bale} = req.body;
            
            console.info("ID ELIMINA ricevuti: " + id_bale)

            if (id_bale !== null && id_bale !== undefined) {

                var query = `DELETE FROM ${this.table} WHERE `;

                // if (id_bale.length > 1) {
                //     for (const id of id_bale) {
                //         console.info(id)
                //     }
                // } else {
                //     console.info(id_bale)
                // }

                const allId = await this.getIdsBale(id_bale)
                const id_pb = allId[0].id_pb
                const id_wb = allId[0].id_wb

                console.info(allId)

                const [check] = await this.db.query(
                    `DELETE FROM ${this.table} WHERE ${this.table}.id_pb=?`,
                    [id_bale]
                )
                console.delete(check)
                
                if (check && check.affectedRows > 0) {
                    // Check deletion of presser bale
                    const [check_dp] = await this.db.query(
                        "DELETE FROM presser_bale WHERE presser_bale.id=?",
                        [id_pb]
                    )
                    console.delete(check_dp)
    
                    // Check deletion of wheelman bale
                    const [check_dw] = await this.db.query(
                        "DELETE FROM wheelman_bale WHERE wheelman_bale.id=?",
                        [id_wb]
                    )
                    console.delete(check_dw)

                    var message = `Balla numero ${id_bale} eliminata con successo!`
                    
                    if (check_dp.affectedRows === 0 || check_dw.affectedRows === 0)
                        message += `\nBalla numero ${id_bale}`
                    
                    res.json({ cod: 0, message })
                } else {
                    res.json({ cod: -1, message: `Errore nell'eliminazione Balla numero ${id_bale}` })
                }
            } else {
                res.json({ code: -1, message: "Nessuna balla specificata" })
            }


        } catch (error) {
            console.error(error)
            res.status(500).send(`Errore durante l'esecuzione della query: ${error}`)
        }
    }
}

module.exports = TotalBale