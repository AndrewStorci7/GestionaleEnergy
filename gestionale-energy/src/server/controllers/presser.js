import Bale from './main/bale.js';
import Console from '../inc/console.js';
import WheelmanBale from './wheelman.js';

const console = new Console("Presser", 1);

/**
 * 
 * @param {datetime} 
 * @param {}
 * 
 * @author Andrea Storci form Oppimittinetworking
 */
class PresserBale extends Bale {

    constructor(db, table) {
        super(db, table);
        this.internalUrl = `${process.env.NEXT_PUBLIC_APP_SERVER_URL}:${process.env.NEXT_PUBLIC_APP_SERVER_PORT}`;
    }

    handlePresserData = async (req, debug = false) => {
        // Debug: verifica cosa viene passato
        // console.debug(`Req ricevuto in handlePresserData:`, req);
        
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
                    code_plastic.code AS 'plastic',
                    code_plastic.desc AS 'code',
                    rei.name AS 'rei',
                    ${this.table}.id_rei AS '_idRei',
                    cond_${this.table}.type AS 'condition',
                    ${this.table}.id_cpb AS '_idCpb',
                    selected_bale.name AS 'selected_bale',
                    ${this.table}.id_sb AS '_idSb',
                    ${this.table}.note AS 'notes',
                    ${this.table}.data_ins AS 'data_ins'
                FROM 
                    ${this.table} 
                JOIN 
                    code_plastic 
                JOIN 
                    cond_${this.table} 
                JOIN 
                    rei 
                JOIN 
                    selected_bale
                ON 
                    ${this.table}.id_cpb = cond_${this.table}.id AND
                    ${this.table}.id_plastic = code_plastic.code AND
                    ${this.table}.id_rei = rei.id AND
                    ${this.table}.id_sb = selected_bale.id
                WHERE 
                    ${this.table}.id = ? LIMIT 1`,
                [id] 
            );
        
            if (debug) console.debug("Risultato query presser:", rows);

            if (rows && rows.length > 0) {
                return { code: 0, data: rows[0] };
            } else {
                return { code: 1, message: "Nessuna balla trovata" };
            }
        } catch (error) {
            console.error("Errore nella query presser:", error);
            return { code: 1, message: `Errore database: ${error.message}` };
        }
    }

    /**
     * Get a single bale
     * 
     * @param {object} req 
     * @param {object} res 
     */
    async get(req, res, fromInside = false) {
        try {
            // console.info(req)
            const data = await this.handlePresserData(req, !fromInside);
            
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
            console.error(error.message);
            if (fromInside) 
                throw `Presser get data Error: ${error.message}`;
            else 
                res.status(500).send(`Presser get data Error: ${error.message}`);
        }
    }

    /**
     * Set a new bale with Presser information
     * 
     * @param {Object} req 
     * @param {Object} res 
     */
    async set(body) {
        try {
            if (!body || typeof body !== 'object') {
                throw new Error("Body non valido");
            }
            console.debug(`${JSON.stringify(body)}, typeof: ${typeof body}`);

            const arr_body = Object.values(body);

            // console.info(body);

            const check_ins_pb = await this.db.query(
                `INSERT INTO ${this.table}(id_presser, id_plastic, id_rei, id_cpb, id_sb, note, data_ins) 
                VALUES( ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP())`,
                arr_body,
            );

            // console.info(check_ins_pb[0]);

            if (check_ins_pb[0].serverStatus === 2) {
                const id_new_bale = check_ins_pb[0].insertId;
                return { code: 0, message: { id: id_new_bale } }
            } else {
                const info = check_ins_pb[0].info;
                return { code: 1, message: { info } };
            }
        } catch (error) {
            console.error(error.message);
            throw `Presser Error Add: ${error.message}`;
        }
    }

    /**
     * Update a bale from the presser
     * 
     * @param {object} req 
     * @param {object} res 
     */
    async update(body) {
        try {
            if (body === null || body === undefined) {
                return { code: 1, message: "Nessun body fornito per l'aggiornamento della balla Wheelman" };
            }

            // Validazione dei parametri
            // const validatedBody = this.validateUpdateBody(body);
            
            const id_plastic = body?.id_plastic;
            const id_bale = body?.where;
            
            if (id_plastic && id_plastic.includes("MDR")) {
                const wheelmanInstance = new WheelmanBale(this.db, "wheelman_bale");
                const getIds = await this.getIdsBale(id_bale, 'presser');

                console.debug(`UPDATE getIds: ${JSON.stringify(getIds)}`);

                if (getIds.code === 0) {
                    await wheelmanInstance.update({
                        id_wd: 2,
                        where: getIds.data[0].id_wb,
                    });
                }
            }

            const san = this.checkParams(body, {scope: "update", table: this.table});
            
            const [check] = await this.db.query(san.query, san.params);
    
            if (check && check.affectedRows > 0) {
                return { code: 0, message: "Balla pressista aggiornata con successo" };
            } else {
                return { code: 1, message: "Nessuna riga aggiornata - verifica l'ID della balla" };
            }
        } catch (error) {
            console.error("Errore in Presser.update():", error);
            throw new Error(`Presser Error Update: ${error.message}`);
        }
    }

    /**
     * Valida e sanitizza i dati per l'update
     * @param {Object} body 
     * @returns {Object}
     */
    validateUpdateBody(body) {
        const validatedBody = {};
        
        // Lista dei campi validi per presser
        const validFields = [
            'id_presser', 'id_plastic', 'id_rei', 'id_cpb', 'id_sb', 'note', 'where'
        ];
        
        for (const [key, value] of Object.entries(body)) {
            if (validFields.includes(key)) {
                // Validazione specifica per campo
                switch (key) {
                    case 'id_presser':
                    case 'id_rei':
                    case 'id_cpb':
                    case 'id_sb': {
                        // Assicurati che gli ID siano numeri interi
                        const intValue = parseInt(value);
                        if (!isNaN(intValue)) {
                            validatedBody[key] = intValue;
                        }
                        break;
                    }
                    case 'id_plastic':
                        // Codice plastica - deve essere una stringa
                        if (typeof value === 'string' && value.trim() !== '') {
                            validatedBody[key] = value.trim();
                        }
                        break;
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

    /**
     * Delete a single bale
     * 
     * @param {object} req
     * @param {object} res
     */
    // async delete(req, res) {
    //     try {

    //     } catch (error) {
            
    //     }
    // }

}

export default PresserBale;