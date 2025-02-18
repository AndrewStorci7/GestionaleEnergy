import Console from '../inc/console.js';
import Common from './main/common.js';

const console = new Console("TotalBale", 1);

/**
 * 
 */
class TotalBale extends Common {

    constructor(db, queue, table) {
        super(db, queue, table);
        this.internalUrl = `${process.env.NEXT_PUBLIC_APP_SERVER_URL}:${process.env.NEXT_PUBLIC_APP_SERVER_PORT}`;
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
        await this.queue.add(async () => {
            try {
                const { data } = req.body;
    
                const id_implant = data.implant;
                var id_new_presser_bale = 0;
                var id_new_wheelman_bale = 0;
    
                const data_presser = await fetch(this.internalUrl + '/presser/set', { 
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ body: data.body })
                })
                .then(_res => _res.json())
                .catch((_err) => console.error(_err));
                id_new_presser_bale = data_presser.message.id_new_bale;
    
                const data_wheelman = await fetch(this.internalUrl + '/wheelman/set', { 
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ body: data.body })
                })
                .then(_res => _res.json())
                .catch((_err) => console.error(_err));
                id_new_wheelman_bale = data_wheelman.message.id_new_bale;
    
                const check_ins_pbwb = await this.db.query(
                    `INSERT INTO ${this.table}(id_pb, id_wb, id_implant, status) VALUES(?, ?, ?, ?)`,
                    [id_new_presser_bale, id_new_wheelman_bale, id_implant, 0]
                );
    
                if (check_ins_pbwb && check_ins_pbwb[0].serverStatus === 2) {
                    res.json({ code: 0, data: { id_presser_bale: id_new_presser_bale, id_wheelman_bale: id_new_wheelman_bale }});
                } else {
                    res.json({ code: 1, message: "Errore nell'inserimento di una nuova balla" });
                }
            } catch (error) {
                console.error(error);
                res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
            }
        }, { priority: 0 });
        console.info("Add new bale completed", "green");
    }

    /**
     * Update the status of a total bale after updating a bale from Presser or Wheelman interface
     * 
     * @param {object} req 
     * @param {object} res 
     */
    async updateStatusTotalBale(req, res) {
        await this.queue.add(async () => {
            try {
                const { body } = req.body;
    
                // console.info("Entrato in updateStatusTotalBale")
    
                const san = this.checkParams(body, { scope: "update", table: this.table })
    
                const [check] = await this.db.query(san.query, san.params);
        
                if (check) {
                    res.json({ code: 0 });
                } else {
                    res.json({ code: 1, message: "Errore nella modifica di una balla" });
                }
    
            } catch (error) {
                console.error(error);
                res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`);
            }
        }, { priority: 0 });
    }

    /**
     * Get a total bale composed by information of the bale created by presser
     * and the information of the bale added by wheelman
     * 
     * @param {object} req
     * @param {object} res
     */
    async get(req, res) {
        await this.queue.add(async () => {
            try {
                const { id_implant } = req.body;
    
                const presserResult = [];
                const wheelmanResult = [];
    
                const _params = super.checkConditionForTurn(id_implant);
    
                const [select] = await this.db.query(
                    `SELECT ${this.table}.id_pb, ${this.table}.id_wb, ${this.table}.status, ${this.table}.id FROM ${this.table} JOIN presser_bale JOIN wheelman_bale JOIN implants ON ${this.table}.id_pb = presser_bale.id AND ${this.table}.id_wb = wheelman_bale.id AND ${this.table}.id_implant = implants.id WHERE ${this.table}.id_implant = ? ${_params.condition} ORDER BY ${this.table}.status ASC, TIME(presser_bale.data_ins) DESC, TIME(wheelman_bale.data_ins) DESC LIMIT 100`,
                    _params.params
                );

                // console.info(select)

                if (select !== 'undefined' || select !== null) {

                    for (const e of select) {

                        var id_presser = e.id_pb;
                        var id_wheelman = e.id_wb;
                        var status = e.status;
                        var id = e.id;

                        const res_presser = await fetch(this.internalUrl + '/presser', { 
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({ id: id_presser })
                        });
                        const data_presser = await res_presser.json();
                        console.info(data_presser);
                        data_presser.status = status;
                        data_presser.idUnique = id;

                        const res_wheelman = await fetch(this.internalUrl + '/wheelman', { 
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({ id: id_wheelman })
                        });
                        const data_wheelman = await res_wheelman.json();
                        data_wheelman.status = status;
                        data_wheelman.idUnique = id;

                        presserResult.push(data_presser);
                        wheelmanResult.push(data_wheelman);
                    };
                }
    
                if ((presserResult && presserResult.length > 0) && (wheelmanResult && wheelmanResult.length > 0)) {
                    // console.info("Sending response");
                    res.json({ code: 0, presser: presserResult, wheelman: wheelmanResult });
                } else {
                    res.json({ code: 1, message: "Nessuna balla trovata" });
                }
                
            } catch (error) {
                console.error(error);
                res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`);
            }
        }, { priority: 0 });
        console.info("Get All Bales completed", "green");
    }

    /**
     * Get all bale 
     * 
     * @param {object} req
     * @param {object} res
     */    
    async getByImplantId(req, res) {
        await this.queue.add(async () => {
            try {
                const { id_implant } = req.body;
            
                // console.info(`Filtrato dal ID Impianto: ${id_implant}`);
            
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
        }, { priority: 0 });
    }

    /**
     * Aggiornamento del conteggio delle balle in tempo reale
     * @param {object} req 
     * @param {object} res 
     */
    async balleTotali(req, res) {
        await this.queue.add(async () => {
            try {
                const { implant } = req.body;
    
                const _params = super.checkConditionForTurn(implant);
                
                const [select] = await this.db.query(
                    `SELECT 
                        COUNT(pb_wb.id_pb) AS "totale_balle"
                    FROM 
                        code_plastic
                    LEFT JOIN presser_bale 
                        ON presser_bale.id_plastic = code_plastic.code
                    LEFT JOIN pb_wb 
                        ON pb_wb.id_pb = presser_bale.id
                    LEFT JOIN wheelman_bale
                        ON pb_wb.id_wb = wheelman_bale.id
                    WHERE 
                        pb_wb.id_implant = ?
                        AND presser_bale.id_rei = 1
                        ${_params.condition}`,
                    _params.params
                );
    
                // console.info(select[0].totale_balle)
    
                if (select && select.length > 0) {
                    res.json({ code: 0, message: select[0].totale_balle });
                } else {
                    res.json({ code: 1, message: "Nessun balla" });
                }
    
            } catch (error) {
                console.error(error);
                res.status(500).send(`Errore durante l'esecuzione della query: ${error}`);
            }
        }, { priority: 0 });
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
        await this.queue.add(async () => {
            try {
                const {id_bale} = req.body;
                
                // console.info("ID ELIMINA ricevuti: " + id_bale)
    
                if (id_bale !== null && id_bale !== undefined) {
    
                    var query = `DELETE FROM ${this.table} WHERE `;
    
                    const allId = await this.getIdsBale(id_bale)
                    const id_pb = allId[0].id_pb
                    const id_wb = allId[0].id_wb
    
                    // console.info(allId)
    
                    const [check] = await this.db.query(
                        `DELETE FROM ${this.table} WHERE ${this.table}.id_pb=?`,
                        [id_bale]
                    )
                    // console.delete(check)
                    
                    if (check && check.affectedRows > 0) {
                        // Check deletion of presser bale
                        const [check_dp] = await this.db.query(
                            "DELETE FROM presser_bale WHERE presser_bale.id=?",
                            [id_pb]
                        )
                        // console.delete(check_dp)
        
                        // Check deletion of wheelman bale
                        const [check_dw] = await this.db.query(
                            "DELETE FROM wheelman_bale WHERE wheelman_bale.id=?",
                            [id_wb]
                        )
                        // console.delete(check_dw)
    
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
                console.error(error);
                res.status(500).send(`Errore durante l'esecuzione della query: ${error}`);
            }
        }, { priority: 0 });
    }
}

export default TotalBale;