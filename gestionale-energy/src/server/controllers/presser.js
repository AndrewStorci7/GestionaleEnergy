const Bale = require('./main/bale')
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

    constructor(db, id = 0, idUser, plastic, rei, cpb, sb, note, datetime = "") {
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
        
        const {id} = req;
        
        console.info(`Data received: ${id}`)

        const [rows] = await this.db.query(
            "SELECT presser_bale.id AS 'id', code_plastic.code AS 'plastic', " +
            "code_plastic.desc AS 'code', " +
            "rei.name AS 'rei', " +
            "cond_presser_bale.type AS 'condition', " +
            "selected_bale.name AS 'selected_bale', " +
            "presser_bale.note AS 'notes', " +
            "presser_bale.data_ins AS 'data_ins' " +
            "FROM presser_bale JOIN code_plastic JOIN cond_presser_bale JOIN rei JOIN selected_bale " +
            "ON presser_bale.id_cpb = cond_presser_bale.id AND " +
            "presser_bale.id_plastic = code_plastic.code AND " +
            "presser_bale.id_rei = rei.id AND " +
            "presser_bale.id_sb = selected_bale.id " +
            "WHERE presser_bale.id = ? LIMIT 1",
            [id]
        )
    
        // console.info(rows)

        if (rows && rows.length > 0) {
            // console.info(rows)
            return rows
        } else {
            console.info(JSON.stringify({ code: 1, message: "Nessuna balla trovata" }))
            return { code: 1, message: "Nessuna balla trovata" }
        }
    };

    async get(req, res) {
        try {
            const data = await this.handlePresserData(req.body);
            
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
            const {body} = req.body;
            
            console.info("[Update]: ", body)
    
            const [check] = await this.db.query(
                "UPDATE presser_bale SET id_presser=? , id_plastic=?, id_rei=?, id_cpb=?, id_sb=?, note=?, data_ins=NOW()" +
                "WHERE id=?",
                [body.id_user, body.id_plastic, body.id_rei, body.id_cpb, body.id_sb, body.note, body.where]
            );
    
            if (check) {
                res.json({ code: 0 })
            } else {
                res.json({ code: 1, message: "Errore nella modifica di una balla" })
            }
        } catch (error) {
            console.error(error)
            res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
        }
    }

}

module.exports = PresserBale