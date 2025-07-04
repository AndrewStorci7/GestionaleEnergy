import Console from '../inc/console.js';
import Common from './main/common.js';
import PresserBale from './presser.js';
import WheelmanBale from './wheelman.js';

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
        this.PresserInstance = new PresserBale(db, "presser_bale");
        this.WheelmanInstance = new WheelmanBale(db, "wheelman_bale");
    }

    //#region ADD
    /**
     * Add Bale on DB
     * 
     * @param {json} req    Contenuto dell'oggetto
     * - `id_implant[int]`: id dell'impianto
     * - `id_presser[int]`: id dell'utente
     */
    async add(req, res) {
        const transaction = await this.db.getConnection();
        
        try {
            await transaction.beginTransaction();
            
            const { data } = req.body;

            if (!data) {
                return res.status(400).json({ 
                    code: 1, 
                    message: "Non sono stati ricevuti i dati: body vuoto" 
                });
            }

            const id_implant = data.implant;
            const gam = (data.body.id_rei == 5) 
                ? JSON.stringify({ is_rei_altro_mag: true, id_implant: data.implant == 1 ? 2 : 1 }) 
                : JSON.stringify({ is_rei_altro_mag: false, id_implant: null });
            
            const checkIfIncludesMDR = data.body.id_plastic.includes('MDR');

            // CHIAMATA DIRETTA invece di fetch - PRESSER
            const presserReq = data.body;
            const presserResult = await this.PresserInstance.set(presserReq, transaction);
            
            if (presserResult.code !== 0) {
                await transaction.rollback();
                res.status(500).json(presserResult);
            }

            const id_new_presser_bale = presserResult.message.id;

            // CHIAMATA DIRETTA invece di fetch - WHEELMAN
            const wheelmanReq = checkIfIncludesMDR ? { id_wd: 2 } : null;
            const wheelmanResult = await this.WheelmanInstance.set(wheelmanReq, transaction);
            
            if (wheelmanResult.code !== 0) {
                await transaction.rollback();
                res.status(500).json(wheelmanResult);
            }

            const id_new_wheelman_bale = wheelmanResult.message.id;

            // Insert nella tabella principale
            const [check_ins_pbwb] = await transaction.query(
                `INSERT INTO ${this.table}(id_pb, id_wb, id_implant, status, gam) VALUES(?, ?, ?, ?, ?)`,
                [id_new_presser_bale, id_new_wheelman_bale, id_implant, 0, gam]
            );

            await transaction.commit();

            res.json({ 
                code: 0, 
                data: { 
                    id_presser_bale: id_new_presser_bale, 
                    id_wheelman_bale: id_new_wheelman_bale 
                }
            });

        } catch (error) {
            await transaction.rollback();
            console.error(`Errore in add(): ${error}`);
            res.status(500).json({ code: 1, message: `Errore durante l'inserimento: ${error}` });
        } finally {
            transaction.release();
        }
    }

    //#region UPDATE STATUS
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
        console.debug("Select data ricevuto:", select);
        
        try {
            for (const e of select) {
                const id_presser = e.id_pb;
                const id_wheelman = e.id_wb;
                const status = e.status;
                const id = e.id;

                // console.debug(`Processando balla - ID Presser: ${id_presser}, ID Wheelman: ${id_wheelman}`);

                if (!id_presser || !id_wheelman) {
                    console.error(`ID non validi - Presser: ${id_presser}, Wheelman: ${id_wheelman}`);
                    continue;
                }

                const data_presser = await this.PresserInstance.get({ body: { id: id_presser } }, null, true);
                if (data_presser === -1) {
                    console.error(`Errore nel recupero dati presser per ID: ${id_presser}`);
                    continue;
                }
                data_presser.status = status;
                data_presser.idUnique = id;
                presserResult.push(data_presser);

                const data_wheelman = await this.WheelmanInstance.get({ body: { id: id_wheelman } }, null, true);
                if (data_wheelman === -1) {
                    console.error(`Errore nel recupero dati wheelman per ID: ${id_wheelman}`);
                    continue;
                }
                data_wheelman.status = status;
                data_wheelman.idUnique = id;
                wheelmanResult.push(data_wheelman);
            }
        } catch (error) {
            console.error("Errore in createObjectArray:", error);
            throw error;
        }
    }

    //#region GET
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

            // console.debug();

            if (useFor === 'specific') {
                cond_status = ' AND pb_wb.status = 1';
            } 
            // else if (useFor === 'reverse') {
            //     order_by = 'ASC';
            // }

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
                        ${this.table}.id_implant = ? AND (${_params.condition})
                        ${cond_status}
                    ORDER BY 
                        IFNULL(presser_bale.data_ins, wheelman_bale.data_ins) ${order_by}
                    LIMIT 300`,
                    _params.params,
                    true
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
            // res.status(500).send(`Errore durante l'esecuzione della query: ${error.message}`);
            throw error;
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
                res.json({ code: 1, message: "Impianto non specificato" });
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
            res.status(500).send(`Errore durante l'esecuzione della query: ${error.message}`);
        }
    }

    async totaleChili(req, res) {
        try {
            const { implant } = req.body;

            if (implant == 0 || implant == undefined ) {
                res.json({ code: 1, message: "Impianto non specificato" });
            }
            const _params = super.checkConditionForTurn(implant); 

            const [countChili] = await this.db.query(
                `SELECT 
                    IFNULL(SUM(wheelman_bale.weight), 0) AS totale_chili
                FROM 
                    pb_wb
                LEFT JOIN wheelman_bale ON pb_wb.id_wb = wheelman_bale.id
                LEFT JOIN presser_bale ON pb_wb.id_pb = presser_bale.id
                WHERE
                    ${this.cond_for_idimplant} AND
                    ${_params.condition}`,
                _params.params,
                true
            );

            console.debug(countChili[0]);
            res.json({ code: 0, message: countChili[0] });
        } catch (error) {
            console.error(error);
            res.status(500).send(`Errore durante l'esecuzione della query: ${error.message}`);
        }
    }

    async update(req, res) {
        try {
            const { body, type } = req.body;

            // console.debug(`Update body ricevuto: ${JSON.stringify(req.body)}`);
            console.debug(`Update body ricevuto: ${JSON.stringify(body)}, ${JSON.stringify(type)}`);

            if (type === 'presser') {
                const presserResult = await this.PresserInstance.update(body);
                if (presserResult.code !== 0) {
                    res.status(500).json(presserResult);
                } else {
                    res.json({ code: 0, message: "Balla aggiornata con successo" });
                }
            } else if (type === 'wheelman') {
                const wheelmanResult = await this.WheelmanInstance.update(body);
                if (wheelmanResult.code !== 0) {
                    res.status(500).json(wheelmanResult);
                } else {
                    res.json({ code: 0, message: "Balla aggiornata con successo" });
                }
            }
        } catch (error) {
            console.error(`Errore nell'aggiornamento della balla: ${error.message}`);
            res.status(500).send(`Errore durante l'esecuzione della query: ${error.message}`);
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
            const { id_bale } = req.body;

            if (id_bale !== null && id_bale !== undefined) {

                const allId = await this.getIdsBale(id_bale);
                if (allId.code !== 0) {
                    res.status(500).json(allId);
                }
                const id_pb = allId.data[0].id_pb;
                const id_wb = allId.data[0].id_wb;

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