import Console from '../inc/console.js';
import Common from './main/common.js';

const console = new Console("TotalBale", 1);

/**
 * Total Bale data: get the data from presser and wheelman
 * 
 * @author Andrea Storci from Oppimittinetworking
 */
class TotalBale extends Common {

    constructor(db, table) {
        super(db, table);
        this.internalUrl = `${process.env.NEXT_PUBLIC_APP_SERVER_URL}:${process.env.NEXT_PUBLIC_APP_SERVER_PORT}`;
    }

    /**
     * Add Bale on DB
     * 
     * @param {json} req    Contenuto dell'oggetto
     * - `id_implant[int]`: id dell'impianto
     * - `id_presser[int]`: id dell'utente
     */
    async add(req, res) {
        try {
            const { data } = req.body;

            if (data === null) {
                res.status(500).send("Non sono stati ricevuti i dati: body vuoto");
            }

            // Controllo se il valore REI è = a 5 (ovvero, REI Altro Mag.), in quel caso
            // vado a modificare l'impianto essendo che viene gestita dall'impianto di provenienza
            const id_implant = data.implant;
            // dato che gestisce la provenienza di una balla da un magazzino diverso
            const gam = (data.body.id_rei == 5) ? JSON.stringify({ is_rei_altro_mag: true, id_implant: data.implant == 1 ? 2 : 1 }) : JSON.stringify({ is_rei_altro_mag: false, id_implant: null });
            var id_new_presser_bale = 0;
            var id_new_wheelman_bale = 0;
            const checkIfIncludesMDR = data.body.id_plastic.includes('MDR'); // controllo che la balla inserita è MDR. Nel caso in cui è MDR vado ad impostare il magazzino di destinazione su Provvisorio

            /// Fetch dei dati del pressista 
            const data_presser = await fetch(this.internalUrl + '/presser/set', { 
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ body: data.body })
            });
            const data_presser_resolved = await data_presser.json();
            id_new_presser_bale = data_presser_resolved.message.id_new_bale;

            /// Fetch dei dati del carrellista
            const data_wheelman = await fetch(this.internalUrl + '/wheelman/set', { 
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ body: checkIfIncludesMDR })
            })
            const data_wheelman_resolved = await data_wheelman.json();
            id_new_wheelman_bale = data_wheelman_resolved.message.id_new_bale;

            const check_ins_pbwb = await this.db.query(
                `INSERT INTO ${this.table}(id_pb, id_wb, id_implant, status, gam) VALUES(?, ?, ?, ?, ?)`,
                [id_new_presser_bale, id_new_wheelman_bale, id_implant, 0, gam]
            );

            if (check_ins_pbwb && check_ins_pbwb[0].serverStatus === 2) {
                res.json({ code: 0, data: { id_presser_bale: id_new_presser_bale, id_wheelman_bale: id_new_wheelman_bale }});
            } else {
                res.json({ code: 1, message: "Errore nell'inserimento di una nuova balla" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`);
        }
    }

    /**
     * Update the status of a total bale after updating a bale from Presser or Wheelman interface
     * 
     * @param {object} req 
     * @param {object} res 
     */
    async updateStatusTotalBale(req, res) {
        try {
            const { body } = req.body;

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
    }

    /**
     * Compone gli array di oggetti per i dati del pressista e del carrellista.
     * @param {object[]} presserResult     Array sul quale aggiugnere i dait del pressista
     * @param {object[]} wheelmanResult    Array sul quale aggiugnere i dait del carrellista
     */
    createObjectArray = async (select, presserResult, wheelmanResult) => {
        // console.debug(select);
        for (const e of select) {
            var id_presser = e.id_pb;
            var id_wheelman = e.id_wb;
            var status = e.status;
            var id = e.id;

            /// Fetch dei dati del pressista
            const res_presser = await fetch(this.internalUrl + '/presser/get', { 
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ id: id_presser })
            });
            const data_presser = await res_presser.json();
            data_presser.status = status;
            data_presser.idUnique = id;

            /// Fetch dei dati del carrellista
            const res_wheelman = await fetch(this.internalUrl + '/wheelman/get', { 
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

    /**
     * Get a total bale composed by information of the bale created by presser
     * and the information of the bale added by wheelman
     * 
     * @param {object} req
     * @param {number} req.id_implant   ID dell'impianto
     * @param {string} req.useFor       [
     *                                      `regular`  => farà visualizzare le balle ancora in lavorazione
     *                                      `specific` => farà visualizzare solamente le balle completate
     *                                      `reverse`  => stamperà le balle al contrario (ordine ascendente) [default: discendente]
     *                                  ]
     * @param {object} res
     */
    async get(req, res) {
        try {
            const { body } = req.body;
            const id_implant = body.id_implant;
            const useFor = body.useFor;
            var cond_status = ' AND pb_wb.status != 1'; // di default è impostato su `pb_wb.status != 1` perché stamperà le balle ancora in lavorazione
            var order_by = 'DESC';

            console.debug(useFor);

            if (useFor === 'specific') {
                cond_status = ' AND pb_wb.status = 1';
            } else if (useFor === 'reverse') {
                order_by = 'ASC';
            }

            if (id_implant == 0) {
                res.json({ code: 1, message: "Nessuna balla trovata" });
            }

            const presserResult = [];
            const wheelmanResult = [];
            const _params = super.checkConditionForTurn(id_implant);

            // balle completate
            if (useFor === 'regular' || useFor === 'reverse' || useFor === 'undefined') {
                await this.getBalesNotCompleted(id_implant, order_by, presserResult, wheelmanResult);
            } else {
                const [select] = await this.db.query(
                    `SELECT 
                        ${this.table}.id_pb, 
                        ${this.table}.id_wb, 
                        ${this.table}.status,
                        ${this.table}.id
                    FROM 
                        ${this.table} 
                    JOIN 
                        presser_bale 
                    JOIN 
                        wheelman_bale 
                    JOIN 
                        implants 
                    ON 
                        ${this.table}.id_pb = presser_bale.id AND
                        ${this.table}.id_wb = wheelman_bale.id AND
                        ${this.table}.id_implant = implants.id
                    WHERE 
                        ${this.table}.id_implant = ? AND (
                        ${_params.condition})
                        ${cond_status}
                    ORDER BY 
                        IFNULL(presser_bale.data_ins, wheelman_bale.data_ins) ${order_by}
                    LIMIT 300`,
                    _params.params
                );

                if (select !== 'undefined' || select !== null) {
                    console.debug(select);
                    await this.createObjectArray(select, presserResult, wheelmanResult);
                }
            }



            if ((presserResult && presserResult.length > 0) && (wheelmanResult && wheelmanResult.length > 0)) {
                res.json({ code: 0, presser: presserResult, wheelman: wheelmanResult });
            } else {
                res.json({ code: 1, message: "Nessuna balla trovata" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`);
        }
    }

    /**
     * Get alla bales from an implant that are not completed 
     * @param {number}      implant        Impianto sul quale fare la ricerca 
     * @param {string}      order_by       Ordine dei dati 
     * @param {object[]}    presserResult  Array al quale verranno aggiunto il risultato (pressista)
     * @param {object[]}    wheelmanResult Array al quale verranno aggiunto il risultato (carrellista)
     */
    async getBalesNotCompleted(implant, order_by, presserResult, wheelmanResult) {
        try {
            const [select] = await this.db.query(
                `SELECT 
                    ${this.table}.id_pb, 
                    ${this.table}.id_wb, 
                    ${this.table}.status,
                    ${this.table}.id
                FROM 
                    ${this.table} 
                JOIN 
                    presser_bale 
                JOIN 
                    wheelman_bale 
                JOIN 
                    implants 
                ON 
                    ${this.table}.id_pb = presser_bale.id AND
                    ${this.table}.id_wb = wheelman_bale.id AND
                    ${this.table}.id_implant = implants.id
                WHERE 
                    ${this.table}.id_implant = ?
                    AND ${this.table}.status != 1 
                ORDER BY 
                    IFNULL(presser_bale.data_ins, wheelman_bale.data_ins) ${order_by}
                LIMIT 300`,
                implant
            );

            if (select !== 'undefined' || select !== null) {
                await this.createObjectArray(select, presserResult, wheelmanResult);
            }
        } catch (error) {
            throw error;
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
        
            const [select] = await this.db.query(
                `SELECT
                    ${this.table}.id_pb, ${this.table}.id_wb, 
                    presser_bale.data_ins AS presser_data, 
                    wheelman_bale.data_ins AS wheelman_data
                FROM 
                    ${this.table} 
                JOIN 
                    presser_bale 
                JOIN 
                    wheelman_bale 
                JOIN 
                    implants 
                ON 
                    ${this.table}.id_pb = presser_bale.id 
                    AND ${this.table}.id_wb = wheelman_bale.id 
                    AND ${this.table}.id_implant = implants.id
                WHERE 
                    ${this.table}.id_implant = ? 
                ORDER BY 
                    presser_bale.data_ins DESC
                LIMIT 300`,
                [id_implant]
            );
        
            if (select && select.length > 0) {
                const presserResult = [];
                const wheelmanResult = [];
        
                for (const e of select) {
                    var id_presser = e.id_pb;
                    var id_wheelman = e.id_wb;
        
                    const [res_presser] = await fetch(this.internalUrl + '/presser/get', { 
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ id: id_presser })
                    }).then(res => res.json());
        
                    const [res_wheelman] = await fetch(this.internalUrl + '/wheelman/get', { 
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

    /**
     * Aggiornamento del conteggio delle balle TOTALI PER TURNO in tempo reale
     * Comprende il conteggio delle balle reimballate
     * 
     * @param {object} req 
     * @param {object} res 
     * 
     * @returns 
     */
    async balleTotali(req, res) {
        try {
            const { implant } = req.body;

            if (implant == 0 || implant == undefined ) {
                res.json({ code: 1, message: "Nessuna balla trovata" });
            }

            const _params = super.checkConditionForTurn(implant);
            
            const [countBalleMagazzino] = await this.db.query(
                `SELECT 
                    COUNT(pb_wb.id_pb) AS "totale_magazzino_turno"
                FROM 
                    code_plastic
                LEFT JOIN presser_bale 
                    ON presser_bale.id_plastic = code_plastic.code
                LEFT JOIN pb_wb 
                    ON pb_wb.id_pb = presser_bale.id
                LEFT JOIN wheelman_bale
                    ON pb_wb.id_wb = wheelman_bale.id
                WHERE 
                    ${this.cond_for_cplastic}
                    AND (${_params.condition})`,
                _params.params
            );

            const [countBalleLavorate] = await this.db.query(
                `SELECT 
                    COUNT(pb_wb.id_pb) AS "totale_balle_lavorate"
                FROM 
                    code_plastic
                LEFT JOIN presser_bale 
                    ON presser_bale.id_plastic = code_plastic.code
                LEFT JOIN pb_wb 
                    ON pb_wb.id_pb = presser_bale.id
                LEFT JOIN wheelman_bale
                    ON pb_wb.id_wb = wheelman_bale.id
                WHERE 
                    ${this.cond_for_idimplant}
                    AND (${_params.condition})`,
                _params.params
            );

            if (countBalleMagazzino && countBalleMagazzino.length > 0 || countBalleLavorate && countBalleLavorate.length > 0) {
                res.json({ 
                    code: 0, 
                    message: countBalleMagazzino[0].totale_magazzino_turno, 
                    message2: countBalleLavorate[0].totale_balle_lavorate
                });
            } else {
                res.json({ code: 1, message: "Nessun balla" });
            }

        } catch (error) {
            console.error(error);
            res.status(500).send(`Errore durante l'esecuzione della query: ${error}`);
        }
    }
        
    async getIdsBale(req, res) {
        try {
            var id = 0; 
            if (typeof req === 'object') {
                id = req.body.body;
            } else {
                id = req;
            }
            console.debug(id);

            const [select] = await this.db.query(
                `SELECT 
                    ${this.table}.id,
                    ${this.table}.id_pb,
                    ${this.table}.id_wb
                FROM 
                    ${this.table} 
                WHERE 
                    ${this.table}.id_pb = ?`,
                [id]
            );
    
            if (select) {
                if (typeof req === 'object')
                    res.json({ code: 0, res: select });
                else 
                    return select;
            } else {
                if (typeof req === 'object')
                    res.json({ code: 0, res: select });
                else 
                    throw "Errore durante la selezione della balla";
            }
        } catch (error) {
            throw error;
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

            if (id_bale !== null && id_bale !== undefined) {

                const allId = await this.getIdsBale(id_bale);
                const id_pb = allId[0].id_pb;
                const id_wb = allId[0].id_wb;

                const [check] = await this.db.query(
                    `DELETE FROM ${this.table} WHERE ${this.table}.id_pb=?`,
                    [id_bale]
                );
                
                if (check && check.affectedRows > 0) {
                    // Check delete of presser bale
                    const [check_dp] = await this.db.query(
                        "DELETE FROM presser_bale WHERE presser_bale.id=?",
                        [id_pb]
                    );

                    // Check delete of wheelman bale
                    const [check_dw] = await this.db.query(
                        "DELETE FROM wheelman_bale WHERE wheelman_bale.id=?",
                        [id_wb]
                    );

                    var message = `Balla numero ${id_bale} eliminata con successo!`;
                    
                    if (check_dp.affectedRows === 0 || check_dw.affectedRows === 0)
                        message += `\nBalla numero ${id_bale}`;
                    
                    res.json({ code: 0, message });
                } else {
                    res.json({ code: -1, message: `Errore nell'eliminazione Balla numero ${id_bale}` });
                }
            } else {
                res.json({ code: -1, message: "Nessuna balla specificata" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send(`Errore durante l'esecuzione della query: ${error}`);
        }
    }
}

export default TotalBale;