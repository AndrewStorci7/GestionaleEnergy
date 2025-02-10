const Bale = require('./main/bale')
const Console = require('../inc/console');

const console = new Console("Wheelman");

/**
 * 
 * @param {datetime} 
 * @param {}
 * 
 * @author Andrea Storci form Oppimittinetworking
 */
class WheelmanBale extends Bale {

    constructor(db, table, id) {
        super(db, table, id)
        // this.idUser = idUser;
        // this.plastic = plastic;
        // this.rei = rei;
        // this.cpb = cpb;
        // this.sb = sb;
        // this.note = note;
    }

    // get info() {
    //     return { 
    //         id: this.id, 
    //         idUser: this.idUser, 
    //         plastic: this.plastic, 
    //         rei: this.rei, 
    //         cpb: this.cpb, 
    //         sb: this.sb,
    //         note: this.note,
    //         datetime: this.datetime
    //     }
    // }

    handleWheelmanData = async (req) => {
        const {id} = req.body;
        
        // console.info(`Id Presser received: ${id}`);
        
        const [rows] = await this.db.query(
            `SELECT ${this.table}.id AS 'id', 
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
            FROM ${this.table} JOIN reas_not_tying JOIN cond_${this.table} JOIN warehouse_dest
            ON ${this.table}.id_cwb = cond_${this.table}.id AND
            ${this.table}.id_rnt = reas_not_tying.id AND
            ${this.table}.id_wd = warehouse_dest.id
            WHERE ${this.table}.id = ? LIMIT 1`,
            [id]
        );
    
        if (rows && rows.length > 0) {
            // console.info(rows) // test
            return rows
        } else {
            console.info({ code: 1, message: "Nessuna balla trovata" }) // test
            return { code: 1, message: "Nessuna balla trovata" }
        }
    };

    async get(req, res) {
        try {
            const data = await this.handleWheelmanData(req);
            
            // console.info(data) // test
            
            if (data.code !== 0) {
                res.json(data)
            } else {
                res.json({ code: 0, data: data.rows })
            }
        } catch (error) {
            console.error(error);
            res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
        }
    }

    async set(req, res) {
        try {
            const { body } = req.body;

            // var arr_body = new Array;

            // if (body !== null)
            //     arr_body = Object.values(body);

            // console.info(body);

            // const check_ins_pb = await this.db.query(
            //     `INSERT INTO ${this.table}(id_presser, id_plastic, id_rei, id_cpb, id_sb, note) 
            //     VALUES( ?, ?, ?, ?, ?, ? )`,
            //     arr_body,
            // );
            console.info(body === null);
            
            // if (body !== null) {
            // }

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

module.exports = WheelmanBale