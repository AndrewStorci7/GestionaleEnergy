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

    constructor(db, table, id, idUser, plastic, rei, cpb, sb, note, datetime = "") {
        super(db, table, id, datetime)
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
            `SELECT ${this.table}.id AS 'id', code_plastic.code AS 'plastic',
            code_plastic.desc AS 'code',
            rei.name AS 'rei',
            ${this.table}.id_rei AS '_idRei',
            cond_${this.table}.type AS 'condition',
            ${this.table}.id_cpb AS '_idCpb',
            selected_bale.name AS 'selected_bale',
            ${this.table}.id_sb AS '_idSb',
            ${this.table}.note AS 'notes',
            ${this.table}.data_ins AS 'data_ins'
            FROM ${this.table} JOIN code_plastic JOIN cond_${this.table} JOIN rei JOIN selected_bale
            ON ${this.table}.id_cpb = cond_${this.table}.id AND
            ${this.table}.id_plastic = code_plastic.code AND
            ${this.table}.id_rei = rei.id AND
            ${this.table}.id_sb = selected_bale.id
            WHERE ${this.table}.id = ? LIMIT 1`,
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

    /**
     * Get a single bale
     * 
     * @param {object} req 
     * @param {object} res 
     */
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

    /**
     * Update a bale from the presser
     * 
     * @param {object} req 
     * @param {object} res 
     */
    async update(req, res) {
        try {
            const {body} = req.body;
            
            console.info("[Update]: ", body)

            const san = this.checkParams(body, {scope: "update", table: this.table})
            
            const [check] = await this.db.query(san.query, san.params);
    
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

module.exports = PresserBale