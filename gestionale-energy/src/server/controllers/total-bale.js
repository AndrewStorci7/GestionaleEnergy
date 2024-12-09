const Console = require('../inc/console')
const Common = require('./main/common')
const PresserBale = require('./presser')
const WheelmanBale = require('./wheelman')

const console = new Console("TotalBale")

/**
 * 
 */
class TotalBale extends Common {

    constructor(db, id, idPB, idWB, implant) {
        super(db, id)
        this.idPB = idPB;
        this.idWB = idWB;
        this.implant = implant;
    }

    /**
     * Add Bale on DB
     * 
     * @param {json} req    { data: 
     *                          {  
     *                              id_implant: [int] id dell'impianto
     *                              id_presser: [int] id dell'utente
     *                          } 
     *                      }
     */
    async add(req, res) {
        try {
            const { data } = req.body;
            const id_implant = data.id_implant;
            const id_presser = data.id_presser;
            
            console.info(`Data (Presser Bale) received: ${id_presser}, ${id_implant}`);
            
            const check_ins_pb = await this.db.query(
                `INSERT INTO presser_bale(id_presser) VALUES (${id_presser})`
            );
            const check_ins_wb = await this.db.query(
                `INSERT INTO wheelman_bale() VALUES ()`
            );
    
            if (check_ins_pb && check_ins_wb) {
                
                const [rows_pb] = await this.db.query("SELECT id FROM presser_bale ORDER BY id DESC LIMIT 1");
    
                const [rows_wb] = await this.db.query("SELECT id FROM wheelman_bale ORDER BY id DESC LIMIT 1");
    
                const check_ins_pbwb = await this.db.query(
                    `INSERT INTO pb_wb VALUES(${rows_pb[0].id}, ${rows_wb[0].id}, ${id_implant})`
                );
    
                if (check_ins_pbwb) {
                    res.json({ code: 0, data: { id_presser_bale: rows_pb[0].id, id_wheelman_bale: rows_wb[0].id }})
                } else {
                    res.json({ code: 1, message: "Errore nell'inserimento di una nuova balla" })
                }
    
            } else {
                res.json({ code: 1, message: 'Errore nell\'inserimento' })
            }
    
        } catch (error) {
            console.error(error)
            res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
        }
    }

    /**
     * Get a total of bale as the format
     */
    async get() {

    }

    /**
     * Get all bale grouped by turn and implant
     */
    async getAll() {

    }
}

module.exports = TotalBale