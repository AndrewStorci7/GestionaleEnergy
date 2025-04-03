import Console from '../inc/console.js';
import Common from './main/common.js';

const console = new Console("TotalBale")

/**
 * Magazzino di destinazione
 * (Warehouse Destination)
 * 
 * @author Andrea Storci from Oppimittinetworking
 */
class Warehouse extends Common {

    constructor(db, table) {
        super(db, table);
    }

    /**
     * Get a total of bale as the format
     */
    async get(req, res) {
        try {
            const [select] = await this.db.query(
                "SELECT * FROM warehouse_dest"
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
     * Get all bale grouped by turn and implant
     */
    async getAll() {

    }
}

export default Warehouse