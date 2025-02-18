import Bale from './main/bale.js';
import Console from '../inc/console.js';;

const console = new Console("Wheelman", 1);

/**
 * 
 * @param {datetime} 
 * @param {}
 * 
 * @author Andrea Storci form Oppimittinetworking
 */
class WheelmanBale extends Bale {

    constructor(db, queue, table) {
        super(db, queue, table);
    }

    handleWheelmanData = async (req) => {
        
        const {id} = req.body;
        // console.info(`Data received: ${id}`, "yellow");
        const [rows] = await this.db.query(
            `SELECT ${this.table}.id AS 'id', cond_${this.table}.type AS 'condition', ${this.table}.id_cwb AS '_idCwb', reas_not_tying.name AS 'reason', ${this.table}.id_rnt AS '_idRnt', ${this.table}.weight AS 'weight', warehouse_dest.name AS 'warehouse', ${this.table}.id_wd AS '_idWd', ${this.table}.note AS 'notes', ${this.table}.printed AS 'is_printed', ${this.table}.data_ins AS 'data_ins' FROM ${this.table} JOIN reas_not_tying JOIN cond_${this.table} JOIN warehouse_dest ON ${this.table}.id_cwb = cond_${this.table}.id AND ${this.table}.id_rnt = reas_not_tying.id AND ${this.table}.id_wd = warehouse_dest.id WHERE ${this.table}.id = ? LIMIT 1`,
            id
        );
    
        if (rows && rows.length > 0) {
            console.info(rows) // test
            return rows;
        } else {
            console.info({ code: 1, message: "Nessuna balla trovata" }) // test
            return { code: 1, message: "Nessuna balla trovata" }
        }
    };

    async get(req, res) {
        await this.queue.add(() => {
            try {
                const data = this.handleWheelmanData(req);
                
                console.info(data) // test
                
                if (data.code !== 0) {
                    res.json(data)
                } else {
                    res.json({ code: 0, data: data.rows })
                }
            } catch (error) {
                console.error(error);
                res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
            }
        }, { priority: 0 });
        console.info("GET Single Bale completed", "green");
    }

    async set(req, res) {
        await this.queue.add(async () => {
            try {
                const check_ins_pb = await this.db.query(
                    `INSERT INTO ${this.table} VALUES ()`,
                );
    
                // console.info(check_ins_pb[0]);
    
                if (check_ins_pb[0].serverStatus === 2) {
                    const id_new_bale = check_ins_pb[0].insertId;
                    res.json({ code: 0, message: { id_new_bale }});
                } else {
                    const info = check_ins_pb[0].info;
                    res.json({ code: 1, message: { info }});
                }
            } catch (error) {
                console.error(error);
                res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
            }
        }, { priority: 0 });
        console.info("SET Single Bale completed", "green");
    }

    async update(req, res) {
        await this.queue.add(async () => {
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
        }, { priority: 0 });
    }

}

export default WheelmanBale