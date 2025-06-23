import Bale from './main/bale.js';
import Console from '../inc/console.js';

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

        // console.debug(`Data received: ${typeof req.body.id}`, "yellow");
        
        const id = req.body.id;
        
        if (id !== 0 && id !== undefined && id !== null) {
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
                id
            );
        
            if (debug) console.debug(rows);

            if (rows && rows.length > 0) {
                return { code: 0, data: rows[0] };
            } else {
                // console.info(JSON.stringify({ code: 1, message: "Nessuna balla trovata" }))
                return { code: 1, message: "Nessuna balla trovata" };
            }
        } else {
            return -1;
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
     */
    async set(data) {
        try {
            const body = data;
            console.debug(data);
            const arr_body = Object.values(body);

            const check_ins_pb = await this.db.query(
                `INSERT INTO ${this.table}(id_presser, id_plastic, id_rei, id_cpb, id_sb, note) 
                VALUES( ?, ?, ?, ?, ?, ? )`,
                arr_body,
            );

            if (check_ins_pb[0].serverStatus === 2) {
                const id_new_bale = check_ins_pb[0].insertId;
                return { code: 0, message: { id_new_bale } }
            } else {
                const info = check_ins_pb[0].info;
                return { code: 1, message: { info } }
            }
        } catch (error) {
            console.error(error.message);
            res.status(500).send(`Presser Error Add: ${error.message}`);
            throw `Presser Error Add: ${error.message}`;
        }
    }

    /**
     * Update a bale from the presser
     * 
     * @param {object} req 
     * @param {object} res 
     */
    async update(req, res) {
        try {
            const { body } = req.body;
            const id_plastic = body?.id_plastic;
            const id_bale = body?.where;
            const checkIfIncludesMDR = id_plastic.includes("MDR");  

            const getIds = await fetch(this.internalUrl + '/bale/ids', { 
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ body: id_bale })
            });
            const respGetIds = await getIds.json();

            if (respGetIds.code === 0) {
                await fetch(this.internalUrl + "/wheelman/update", {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ body: {
                        id_wd: checkIfIncludesMDR ? 2 : 1,
                        where: respGetIds.res[0].id_wb,
                    }})
                })
            }

            const san = this.checkParams(body, {scope: "update", table: this.table})
            
            const [check] = await this.db.query(san.query, san.params);
    
            if (check) {
                res.json({ code: 0 })
            } else {
                res.json({ code: 1, message: "Errore nella modifica di una balla" })
            }
        } catch (error) {
            res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
            throw error;
        }
    }

    /**
     * Delete a single bale
     * 
     * @param {object} req
     * @param {object} res
     */
    async delete(req, res) {
        try {

        } catch (error) {
            
        }
    }

}

export default PresserBale;

// import Bale from './main/bale.js';
// import Console from '../inc/console.js';
// import TotalBale from './total-bale.js';

// const console = new Console("Presser", 1);

// /**
//  * 
//  * @param {datetime} 
//  * @param {}
//  * 
//  * @author Andrea Storci form Oppimittinetworking
//  */
// class PresserBale extends Bale {

//     constructor(db, table) {
//         super(db, table);
//         this.internalUrl = `${process.env.NEXT_PUBLIC_APP_SERVER_URL}:${process.env.NEXT_PUBLIC_APP_SERVER_PORT}`;
//     }

//     handlePresserData = async (req) => {
        
//         const { id } = req.body;
//         // console.debug(`Data received: ${id}`, "yellow");
//         if (id !== undefined && id !== null && id !== 0) {

//             const [rows] = await this.db.query(
//                 `SELECT 
//                     ${this.table}.id AS 'id', 
//                     code_plastic.code AS 'plastic',
//                     code_plastic.desc AS 'code',
//                     rei.name AS 'rei',
//                     ${this.table}.id_rei AS '_idRei',
//                     cond_${this.table}.type AS 'condition',
//                     ${this.table}.id_cpb AS '_idCpb',
//                     selected_bale.name AS 'selected_bale',
//                     ${this.table}.id_sb AS '_idSb',
//                     ${this.table}.note AS 'notes',
//                     ${this.table}.data_ins AS 'data_ins'
//                 FROM 
//                     ${this.table} 
//                 JOIN 
//                     code_plastic 
//                 JOIN 
//                     cond_${this.table} 
//                 JOIN 
//                     rei 
//                 JOIN 
//                     selected_bale
//                 ON 
//                     ${this.table}.id_cpb = cond_${this.table}.id AND
//                     ${this.table}.id_plastic = code_plastic.code AND
//                     ${this.table}.id_rei = rei.id AND
//                     ${this.table}.id_sb = selected_bale.id
//                 WHERE 
//                     ${this.table}.id = ? LIMIT 1`,
//                 id
//             );
    
//             if (rows && rows.length > 0) {
//                 return rows[0];
//             } else {
//                 // console.info(JSON.stringify({ code: 1, message: "Nessuna balla trovata" }))
//                 return { code: 1, message: "Nessuna balla trovata" };
//             }
//         } else {
//             throw new Error("ID non fornito o nullo");
//         }
//     }

//     /**
//      * Get a single bale
//      * 
//      * @param {object} req 
//      * @param {object} res 
//      */
//     async get(req, res) {
//         try {
//             const data = await this.handlePresserData(req);
    
//             if (data.code !== 0) { // Nel caso in cui non ottengo dati
//                 res.json(data);
//             } else { // in caso contrario, invio i dati
//                 res.json({ code: 0, data: data });
//             }
//         } catch (error) {
//             console.error(error);
//             res.status(500).send(`Errore durante l\'esecuzione della query: ${error.message}`);
//         }
//     }

//     /**
//      * Set a new bale with Presser information
//      * 
//      * @param {Object} req 
//      * @param {Object} res 
//      */
//     async set(req, res) {
//         try {
//             const { body } = req.body;
//             const arr_body = Object.values(body);

//             // console.info(body);

//             const check_ins_pb = await this.db.query(
//                 `INSERT INTO ${this.table}(id_presser, id_plastic, id_rei, id_cpb, id_sb, note) 
//                 VALUES( ?, ?, ?, ?, ?, ? )`,
//                 arr_body,
//             );

//             // console.info(check_ins_pb[0]);

//             if (check_ins_pb[0].serverStatus === 2) {
//                 const id_new_bale = check_ins_pb[0].insertId;
//                 res.json({ code: 0, message: { id_new_bale } });
//             } else {
//                 const info = check_ins_pb[0].info;
//                 res.json({ code: 1, message: { info } });
//             }
//         } catch (error) {
//             throw error;
//         }
//     }

//     /**
//      * Update a bale from the presser
//      * 
//      * @param {object} req 
//      * @param {object} res 
//      */
//     async update(req, res) {
//         try {
//             const { body } = req.body;
//             const id_plastic = body?.id_plastic;
//             const id_bale = body?.where;
//             const checkIfIncludesMDR = id_plastic.includes("MDR");  

//             const getIds = await fetch(this.internalUrl + '/bale/ids', { 
//                 method: 'POST',
//                 headers: {'Content-Type': 'application/json'},
//                 body: JSON.stringify({ body: id_bale })
//             });
//             const respGetIds = await getIds.json();

//             if (respGetIds.code === 0) {
//                 await fetch(this.internalUrl + "/wheelman/update", {
//                     method: 'POST',
//                     headers: {'Content-Type': 'application/json'},
//                     body: JSON.stringify({ body: {
//                         id_wd: checkIfIncludesMDR ? 2 : 1,
//                         where: respGetIds.res[0].id_wb,
//                     }})
//                 })
//             }

//             const san = this.checkParams(body, {scope: "update", table: this.table})
            
//             const [check] = await this.db.query(san.query, san.params);
    
//             if (check) {
//                 res.json({ code: 0 })
//             } else {
//                 res.json({ code: 1, message: "Errore nella modifica di una balla" })
//             }
//         } catch (error) {
//             throw error;
//             // res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
//         }
//     }

//     /**
//      * Delete a single bale
//      * 
//      * @param {object} req
//      * @param {object} res
//      */
//     async delete(req, res) {
//         try {

//         } catch (error) {
            
//         }
//     }

// }

// export default PresserBale;