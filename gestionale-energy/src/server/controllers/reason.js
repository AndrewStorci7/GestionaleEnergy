import Common from './main/common.js';
import Console from '../inc/console.js';

const console = new Console("Reason");

/**
 * Motivazione balla
 * (Reason)
 * 
 * @author Andrea Storci from Oppimittinetworking
 */
class Reason extends Common {
    
    constructor(db, table) {
        super(db, table);
    }

    /**
     * Get reason for not tying information
     * 
     * @param {object} req  object request 
     * @param {object} res  object response 
     */
    async get(req, res) {
        try {
            const [select] = await this.db.query(
                "SELECT * FROM reas_not_tying"
            );
    
            if (select && select.length > 0) {
                // console.info(select)
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
     * Set a new reason
     * 
     * @param {object} req  object request 
     * @param {object} res  object response 
     */
    async set(req, res) {
        // TODO
    }
}

export default Reason