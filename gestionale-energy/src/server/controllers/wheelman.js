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
        
        const {id} = req.body;
        // console.info(`Data received: ${id}`, "yellow");
        if (id !== 0 && id !== undefined && id !== null) {

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
                id
            );
    
            if (debug) console.debug(rows);
        
            if (rows && rows.length > 0) {
                // console.info(rows) // test
                // return { code: 0, data: rows[0] };
                return { code: 0, data: rows[0] };
            } else {
                // console.info({ code: 1, message: "Nessuna balla trovata" }) // test
                return { code: 1, message: "Nessuna balla trovata" }
            }
        } else {
            return -1;
        }
    };

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
            console.error(error.message);
            if (fromInside) 
                throw `Wheelman get data Error: ${error.message}`;
            else 
                res.status(500).send(`Wheelman get data Error: ${error.message}`);
        }
    }

    async set(req, res) {
        try {

            const { body } = req.body;
            var query = "";
            
            if (body) {
                query = `INSERT INTO ${this.table}(id_wd) VALUES (2)`;
            } else {
                query = `INSERT INTO ${this.table} VALUES ()`;
            }

            const check_ins_pb = await this.db.query(query);

            if (check_ins_pb[0].serverStatus === 2) {
                const id_new_bale = check_ins_pb[0].insertId;
                res.json({ code: 0, message: { id_new_bale }});
            } else {
                const info = check_ins_pb[0].info;
                res.json({ code: 1, message: { info }});
            }
        } catch (error) {
            console.error(error.message);
            res.send(500).send(`Wheelman Error Add: ${error.message}`);
            throw `Wheelman Error Add: ${error.message}`;
        }
    }

    async update(req, res) {
        try {
            const { body } = req.body;

            const san = this.checkParams(body, {scope: "update", table: this.table})
            
            const [check] = await this.db.query(san.query, san.params);
    
            if (check) {
                res.json({ code: 0 });
            } else {
                res.json({ code: 1, message: "Errore nella modifica di una balla" });
            }
        } catch (error) {
            console.error(error)
            res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
        }
    }

}

export default WheelmanBale

// import Bale from './main/bale.js';
// import Console from '../inc/console.js';;

// const console = new Console("Wheelman", 1);

// /**
//  * Gestisce i dati della balla lato carrellista
//  * @author Andrea Storci form Oppimittinetworking
//  */
// class WheelmanBale extends Bale {

//     constructor(db, table) {
//         super(db, table);
//     }

//     handleWheelmanData = async (req) => {
        
//         const { id } = req.body;
//         if (id !== undefined && id !== null && id !== 0) {
//             // console.info(`Data received: ${id}`, "yellow");
    
//             const [rows] = await this.db.query(
//                 `SELECT 
//                     ${this.table}.id AS 'id', 
//                     cond_${this.table}.type AS 'condition', 
//                     ${this.table}.id_cwb AS '_idCwb', 
//                     reas_not_tying.name AS 'reason', 
//                     ${this.table}.id_rnt AS '_idRnt', 
//                     ${this.table}.weight AS 'weight', 
//                     warehouse_dest.name AS 'warehouse', 
//                     ${this.table}.id_wd AS '_idWd', 
//                     ${this.table}.note AS 'notes', 
//                     ${this.table}.printed AS 'is_printed', 
//                     ${this.table}.data_ins AS 'data_ins' 
//                 FROM 
//                     ${this.table} 
//                 JOIN 
//                     reas_not_tying 
//                 JOIN 
//                     cond_${this.table} 
//                 JOIN 
//                     warehouse_dest 
//                 ON 
//                     ${this.table}.id_cwb = cond_${this.table}.id 
//                 AND 
//                     ${this.table}.id_rnt = reas_not_tying.id 
//                 AND 
//                     ${this.table}.id_wd = warehouse_dest.id 
//                 WHERE 
//                     ${this.table}.id = ? LIMIT 1`,
//                 id
//             );
        
//             if (rows && rows.length > 0) {
//                 // console.info(rows) // test
//                 return rows[0];
//             } else {
//                 // console.info({ code: 1, message: "Nessuna balla trovata" }) // test
//                 return { code: 1, message: "Nessuna balla trovata" }
//             }
//         } else {
//             throw new Error("ID non fornito o nullo");
//         }
//     };

//     async get(req, res) {
//         try {
//             const data = await this.handleWheelmanData(req);
            
//             // console.info(data) // test
            
//             if (data.code !== 0) { // Nel caso in cui non ottengo dati
//                 res.json(data);
//             } else { // in caso contrario, invio i dati
//                 res.json({ code: 0, data: data });
//             }
//         } catch (error) {
//             throw error;
//         }
//     }

//     async set(req, res) {
//         try {

//             const { body } = req.body;
//             var query = "";
            
//             if (body) {
//                 query = `INSERT INTO ${this.table}(id_wd) VALUES (2)`;
//             } else {
//                 query = `INSERT INTO ${this.table} VALUES ()`;
//             }

//             const check_ins_pb = await this.db.query(query);

//             if (check_ins_pb[0].serverStatus === 2) {
//                 const id_new_bale = check_ins_pb[0].insertId;
//                 res.json({ code: 0, message: { id_new_bale }});
//             } else {
//                 const info = check_ins_pb[0].info;
//                 res.json({ code: 1, message: { info }});
//             }
//         } catch (error) {
//             throw error;
//         }
//     }

//     async update(req, res) {
//         try {
//             const { body } = req.body;

//             const san = this.checkParams(body, {scope: "update", table: this.table})
            
//             const [check] = await this.db.query(san.query, san.params);
    
//             if (check) {
//                 res.json({ code: 0 });
//             } else {
//                 res.json({ code: 1, message: "Errore nella modifica di una balla" });
//             }
//         } catch (error) {
//             console.error(error)
//             res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
//         }
//     }

// }

// export default WheelmanBale
