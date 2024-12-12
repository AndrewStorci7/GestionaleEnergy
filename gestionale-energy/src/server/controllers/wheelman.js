const Bale = require('./bale')
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
        const { id_user } = req.body;
        
        console.info(`Id Presser received: ${id_user}`);
        
        const [rows] = await this.db.query(
            `SELECT 
            cond_wheelman_bale.type AS 'condition',
            reas_not_tying.name AS 'reason',
            wheelman_bale.weight AS 'weight',
            warehouse_dest.name AS 'warehouse',
            wheelman_bale.note AS 'notes',
            wheelman_bale.printed AS 'is_printed',
            wheelman_bale.data_ins AS 'data_ins'
            FROM wheelman_bale JOIN reas_not_tying JOIN cond_wheelman_bale JOIN warehouse_dest JOIN user
            ON wheelman_bale.id_wheelman = user.id AND
            wheelman_bale.id_cwb = cond_wheelman_bale.id AND
            wheelman_bale.id_rnt = reas_not_tying.id AND
            wheelman_bale.id_wd = warehouse_dest.id
            WHERE wheelman_bale.id_wheelman = ${id_user} LIMIT 100`
        );
    
        if (rows && rows.length > 0) {
            console.info(JSON.stringify(rows)) // test
            return { code: 0, rows }
        } else {
            console.info({ code: 1, message: "Nessuna balla trovata" }) // test
            return { code: 1, message: "Nessuna balla trovata" }
        }
    };

    async getWheelmanBale(req, res) {
        try {
            const data = await this.handleWheelmanData(req);
            
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
    }

    async setPresserBale(req, res) {
        // TODO
    }

}

module.exports = WheelmanBale