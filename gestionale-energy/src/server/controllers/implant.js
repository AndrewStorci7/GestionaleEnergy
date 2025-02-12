import Common from './main/common.js';;
import Console from '../inc/console.js';;

const console = new Console("Implant");

/**
 * Impianto
 * (Implant)
 * 
 * @author Andrea Storci from Oppimittinetworking
 */
class Implant extends Common {
    
    constructor(db, queue, table) {
        super(db, queue, table);
    }

    /**
     * Get condition presser bale information
     * 
     * @param {object} req  object request 
     * @param {object} res  object response 
     */
    async get(req, res) {
        await this.queue.add(async () => {
            try {
                const [select] = await this.db.query(
                    "SELECT * FROM implants"
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
        }, { priority: 0 });
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

export default Implant