const Bale = require('./bale')
const Console = require('../inc/console');

const console = new Console("Presser");

/**
 * 
 * @param {datetime} 
 * @param {}
 * 
 * @author Andrea Storci form Oppimittinetworking
 */
class PresserBale extends Bale {

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

    handlePresserData = async (req) => {
        const { id_user } = req.body;
        
        console.info(`Id Presser received: ${id_user}`)

        const [rows] = await this.db.query(
            `SELECT
            code_plastic.code AS 'plastic',
            code_plastic.desc AS 'code',
            rei.name AS 'rei',
            cond_presser_bale.type AS 'condition',
            selected_bale.name AS 'selected_bale',
            presser_bale.note AS 'notes',
            presser_bale.data_ins AS 'data_ins'
            FROM presser_bale JOIN code_plastic JOIN cond_presser_bale JOIN rei JOIN selected_bale JOIN user
            ON presser_bale.id_cpb = cond_presser_bale.id AND
            presser_bale.id_plastic = code_plastic.code AND
            presser_bale.id_presser = user.id AND
            presser_bale.id_rei = rei.id AND
            presser_bale.id_sb = selected_bale.id
            WHERE TIME(presser_bale.data_ins) LIMIT 100`
        )
    
        if (rows && rows.length > 0) {
            console.info(JSON.stringify(rows))
            return { code: 0, rows }
        } else {
            console.info(JSON.stringify({ code: 1, message: "Nessuna balla trovata" }))
            return { code: 1, message: "Nessuna balla trovata" }
        }
    };

    async getPresserBale(req, res) {
        try {
            const data = await this.handlePresserData(req);
            
            console.info(data)
    
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

module.exports = PresserBale