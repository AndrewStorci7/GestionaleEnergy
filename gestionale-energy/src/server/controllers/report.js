const Common = require('./main/common');
const Console = require('../inc/console');

const console = new Console("Report");

/**
 * 
 * 
 * @author Daniele Zeraschi from Oppimittinetworking
 */
class Report extends Common {
    
    constructor(db, table, id) {
        super(db, table, id);
    }

    /**
     * 
     * 
     * @param {object} req  object request 
     * @param {object} res  object response 
     */
    async reportGiornaliero(req, res) {
        try {

            const { body } = req.body;
            const implant = body.implant;

            const data = []

            for (let i = 1; i <= 3; ++i) {

                const turn = super.checkTurn(i)
                
                const [select] = await this.db.query(
                    `SELECT 
                        code_plastic.code, 
                        SUM(wheelman_bale.weight) AS "totale_peso",
                        COUNT(pb_wb.id_pb) AS "totale_balle"
                    FROM 
                        code_plastic
                    LEFT JOIN presser_bale 
                        ON presser_bale.id_plastic = code_plastic.code
                    LEFT JOIN pb_wb 
                        ON pb_wb.id_pb = presser_bale.id
                    LEFT JOIN wheelman_bale
                        ON pb_wb.id_wb = wheelman_bale.id
                    WHERE 
                        pb_wb.id_implant = ?
                        AND DATE(presser_bale.data_ins) = CURDATE()
                        AND DATE(wheelman_bale.data_ins) = CURDATE()
                        AND TIME(presser_bale.data_ins) BETWEEN ? AND ?
                        AND TIME(wheelman_bale.data_ins) BETWEEN ? AND ?
                    GROUP BY 
                        code_plastic.code
                    LIMIT 100`,
                    [implant, turn[0], turn[1], turn[0], turn[1]]
                );

                if (select && select.length > 0) {
                    data.push(select)
                }
            }

            if (data && data.length > 0) {
                // console.info(select)
                res.json({ code: 0, data: data })
            } else {
                res.json({ code: 1, message: "No data fetched" })
            }
        } catch (error) {
            console.error(error)
            res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
        }
    }
}

module.exports = Report