import Common from './main/common.js';
import Console from '../inc/console.js';

const console = new Console("Plastic");

/**
 * Codici plastiche
 * (Plastic code)
 * 
 * @author Andrea Storci from Oppimittinetworking
 */
class Plastic extends Common {
    
    constructor(db, table) {
        super(db, table);
    }

    /**
     * Get plastic code information
     * 
     * @param {object} req  object request 
     * @param {object} res  object response 
     */
    async get(req, res) {
        try {
            const [select] = await this.db.query(
                "SELECT code_plastic.code AS code, code_plastic.type AS plastic_type, code_plastic.desc FROM code_plastic"
            );
    
            if (select && select.length > 0) {
                // console.info(select)
                res.json({ code: 0, data: select })
            } else {
                res.json({ code: 1, message: "No data fetched" })
            }
        } catch (error) {
            console.error(error)
            res.status(500).send(`Errore durante l'esecuzione della query: ${error}`)
        }
    }

    /**
     * Set a new plastic code
     * 
     */
    // async set(req, res) {
    //     // TODO
    // }
}

export default Plastic