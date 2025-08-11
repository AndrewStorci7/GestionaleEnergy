import Bale from './main/bale.js';
import Console from '../inc/console.js';;

const console = new Console("Wheelman", 1);

/**
 * Gestisce i dati della balla lato carrellista
 * @author Andrea Storci form Oppimittinetworking
 */
class WheelmanBale extends Bale {

    constructor(db, table) {
        super(db, table);
    }

    handleWheelmanData = async (req, debug) => {
        console.debug(`Req ricevuto in handleWheelmanData: ${req.body}`);
        
        let id;
        if (req && req.body) {
            id = req.body.id;
        } else if (typeof req === 'object' && req.id !== undefined) {
            id = req.id;
        } else if (typeof req === 'number') {
            id = req;
        }
        
        // console.debug(`ID estratto: ${id}, tipo: ${typeof id}`);
        
        if (id === null || id === undefined || id === 0 || id === '') {
            console.error(`ID non valido ricevuto: ${id}`);
            return { code: 1, message: "ID non fornito o non valido" };
        }

        try {
            const [rows] = await this.db.query(
                `SELECT 
                    ${this.table}.id AS 'id', 
                    cond_${this.table}.type AS 'condition', 
                    ${this.table}.id_cwb AS '_idCwb', 
                    reas_not_tying.name AS 'reason', 
                    ${this.table}.id_rnt AS '_idRnt', 
                    ${this.table}.weight AS 'weight', 
                    warehouse_dest.name AS 'warehouse', 
                    ${this.table}.id_wd AS '_idWd', 
                    ${this.table}.note AS 'notes', 
                    ${this.table}.printed AS 'is_printed', 
                    ${this.table}.data_ins AS 'data_ins' 
                FROM 
                    ${this.table} 
                JOIN 
                    reas_not_tying 
                JOIN 
                    cond_${this.table} 
                JOIN 
                    warehouse_dest 
                ON 
                    ${this.table}.id_cwb = cond_${this.table}.id 
                AND 
                    ${this.table}.id_rnt = reas_not_tying.id 
                AND 
                    ${this.table}.id_wd = warehouse_dest.id 
                WHERE 
                    ${this.table}.id = ? LIMIT 1`,
                [id] 
            );

            if (debug) console.debug(`Risultato query wheelman: ${rows}`);

            if (rows && rows.length > 0) {
                return { code: 0, data: rows[0] };
            } else {
                return { code: 1, message: "Nessuna balla trovata" };
            }
        } catch (error) {
            console.error(`Errore nella query wheelman: ${error}`);
            return { code: 1, message: `Errore database: ${error.message}` };
        }
    }

    async get(req, res, fromInside = false) {
        try {
            // console.info(req)
            const data = await this.handleWheelmanData(req, !fromInside);
            
            // console.info(data) // test
            
            if (data.code !== 0) { // Nel caso in cui non ottengo dati
                if (fromInside) 
                    return -1;
                else  
                    res.json(data);
            } else { // in caso contrario, invio i dati
                if (fromInside)
                    return data.data;
                else  
                    res.json({ code: 0, data: data.data });
            }
        } catch (error) {
            console.error(`Wheelman get data Error: ${error.message}`);
            if (fromInside) 
                throw `Wheelman get data Error: ${error.message}`;
            else 
                res.status(500).send(`Wheelman get data Error: ${error.message}`);
        }
    }

    async set(body) {
        try {

            console.debug(`Body ricevuto in set: ${JSON.stringify(body)}, tipo: ${typeof body}`);

            var query = "", check_ins_pb = null;

            if (body !== null && typeof body === 'object') {
                if (typeof body.id_wd !== 'number' || body.id_wd <= 0) {
                    throw new Error("id_wd deve essere un numero positivo");
                }
                query = `INSERT INTO ${this.table}(id_wd, data_ins) VALUES (?, CURRENT_TIMESTAMP())`;
                check_ins_pb = await this.db.query(query, [body.id_wd]);
            } else {
                query = `INSERT INTO ${this.table}(data_ins) VALUES (CURRENT_TIMESTAMP())`;
                check_ins_pb = await this.db.query(query);
            }


            if (check_ins_pb[0].serverStatus === 2) {
                const id_new_bale = check_ins_pb[0].insertId;
                return { code: 0, message: { id: id_new_bale } };
            } else {
                const info = check_ins_pb[0].info;
                // res.json({ code: 1, message: { info }});
                return { code: 1, message: `Errore durante l'inserimento della balla Wheelman: ${info}` };
            }
        } catch (error) {
            console.error(error.message);
            // res.send(500).send(`Wheelman Error Add: ${error.message}`);
            throw `Wheelman Error Add: ${error.message}`;
        }
    }

    async update(body) {
        try {
            if (body === null || body === undefined) {
                return { code: 1, message: "Nessun body fornito per l'aggiornamento della balla Wheelman" };
            }

            // Validazione dei parametri prima di processarli
            // const validatedBody = this.validateUpdateBody(body);
            
            const san = this.checkParams(body, {scope: "update", table: this.table});
            
            const [check] = await this.db.query(san.query, san.params);
    
            if (check && check.affectedRows > 0) {
                return { code: 0, message: "Balla carrellista aggiornata con successo" };
            } else {
                return { code: 1, message: "Nessuna riga aggiornata - verifica l'ID della balla" };
            }
        } catch (error) {
            console.error(`Wheelman Error Update: ${error.message}`);
            throw new Error(`Wheelman Error Update: ${error.message}`);
        }
    }

    /**
     * Valida e sanitizza i dati per l'update
     * @param {Object} body 
     * @returns {Object}
     */
    validateUpdateBody(body) {
        const validatedBody = {};
        
        // Lista dei campi validi per wheelman
        const validFields = [
            'id_cwb', 'id_rnt', 'id_wd', 'weight', 'note', 'printed', 'where'
        ];
        
        for (const [key, value] of Object.entries(body)) {
            if (validFields.includes(key)) {
                // Validazione specifica per campo
                switch (key) {
                    case 'weight': {
                        // Assicurati che il peso sia un numero valido
                        const weightValue = parseFloat(value);
                        if (!isNaN(weightValue) && weightValue >= 0) {
                            validatedBody[key] = weightValue;
                        }
                        break;
                    }
                    case 'id_cwb':
                    case 'id_rnt':
                    case 'id_wd':
                    case 'printed': {
                        // Assicurati che gli ID siano numeri interi
                        const intValue = parseInt(value);
                        if (!isNaN(intValue)) {
                            validatedBody[key] = intValue;
                        }
                        break;
                    }
                    case 'note':
                        // Gestione delle note - può essere stringa vuota o null
                        if (value === null || value === undefined) {
                            validatedBody[key] = null;
                        } else {
                            validatedBody[key] = String(value).trim();
                        }
                        break;
                    case 'where': {
                        // ID per la clausola WHERE
                        const whereValue = parseInt(value);
                        if (!isNaN(whereValue) && whereValue > 0) {
                            validatedBody[key] = whereValue;
                        }
                        break;
                    }
                    default:
                        validatedBody[key] = value;
                }
            }
        }
        
        console.debug(`Validated body: ${JSON.stringify(validatedBody)}`);
        return validatedBody;
    }

}

export default WheelmanBale;