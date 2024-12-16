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

    constructor(db, id, idUser, plastic, rei, cpb, sb, note, datetime) {
        super(db, id, datetime)
        this.idUser = idUser;
        this.plastic = plastic;
        this.rei = rei;
        this.cpb = cpb;
        this.sb = sb;
        this.note = note;
    }

    get info() {
        return { 
            id: this.id, 
            idUser: this.idUser, 
            plastic: this.plastic, 
            rei: this.rei, 
            cpb: this.cpb, 
            sb: this.sb,
            note: this.note,
            datetime: this.datetime
        }
    }

    handleWheelmanData = async (req) => {
        const {id} = req.body;
        
        console.info(`Id Presser received: ${id}`);
        
        const [rows] = await this.db.query(
            "SELECT wheelman_bale.id AS 'id', cond_wheelman_bale.type AS 'condition', " + 
            "reas_not_tying.name AS 'reason', " +
            "wheelman_bale.weight AS 'weight', " +
            "warehouse_dest.name AS 'warehouse', " +
            "wheelman_bale.note AS 'notes', " +
            "wheelman_bale.printed AS 'is_printed', " +
            "wheelman_bale.data_ins AS 'data_ins' " +
            "FROM wheelman_bale JOIN reas_not_tying JOIN cond_wheelman_bale JOIN warehouse_dest " +
            "ON wheelman_bale.id_cwb = cond_wheelman_bale.id AND " +
            "wheelman_bale.id_rnt = reas_not_tying.id AND " +
            "wheelman_bale.id_wd = warehouse_dest.id " +
            "WHERE wheelman_bale.id = ? LIMIT 1",
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
        // TODO
    }

    async update(req, res) {
        try {
            const { body } = req.body;
    
            console.info(body)

            const [check] = await this.db.query(
                "UPDATE wheelman_bale SET id_wheelman=?, id_cwb=?, id_rnt=?, id_wd=?, note=?, printed=?, data_ins=NOW(), weigth=?" + 
                "WHERE id=?",
                [body.id_user, body.id_cwb, body.id_rnt, body.id_wd, body.note, body.isPrinted, body.weight, body.where]
            );
    
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