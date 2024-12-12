const Common = require('./main/common');
const Console = require('../inc/console');

const console = new Console("Rei");

/**
 * Informazioni di Reimballaggio
 * (Rei)
 * 
 * @author Andrea Storci from Oppimittinetworking
 */
class Rei extends Common {
    
    constructor(db, id, name) {
        super(db, id);
        this.name = name;
    }

    /**
     * Get condition presser bale information
     * 
     * @param {object} req  object request 
     * @param {object} res  object response 
     */
    async get(req, res) {
        try {
            const [select] = await this.db.query(
                "SELECT * FROM rei"
            );
    
            if (select && select.length > 0) {
                console.info(select)
                res.json({ code: 0, data: select })
            } else {
                res.json({ code: 1, message: "No data fetched" })
            }
        } catch (error) {
            console.error(error)
            res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
        }
    }

    /**
     * Set a new bale condition
     * 
     * @param {object} req  object request 
     * @param {object} res  object response 
     */
    async set(req, res) {
        // TODO
    }
}

module.exports = Rei