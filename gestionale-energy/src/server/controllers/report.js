import Common from './main/common.js';;
import Console from '../inc/console.js';;

const console = new Console("Report");

/**
 * 
 * 
 * @author Daniele Zeraschi from Oppimittinetworking
 */
class Report extends Common {
    
    constructor(db, table) {
        super(db, table);
    }

    /**
     * 
     * 
     * @param {object} req  object request 
     * @param {object} res  object response 
     */
    async reportGiornaliero(req, res) {
        try {
            const { implant } = req.body;

            co

            const data = new Array(3);

            for (let i = 1; i < 4; ++i) {

                const params = super.checkConditionForTurn(implant, "report", i);
                
                const [select] = await this.db.query(
                    `SELECT 
                        code_plastic.code, 
                        code_plastic.desc,
                        SUM(wheelman_bale.weight) AS "totale_peso",
                        COUNT(pb_wb.id_pb) AS "totale_balle"
                    FROM 
                        code_plastic
                    LEFT JOIN presser_bale 
                        ON presser_bale.id_plastic = code_plastic.code
                        ${params.condition.first}
                        ${params.condition.second}
                    LEFT JOIN pb_wb 
                        ON pb_wb.id_pb = presser_bale.id
                        ${params.condition.third}
                    LEFT JOIN wheelman_bale
                        ON pb_wb.id_wb = wheelman_bale.id
                        ${params.condition.fourth}
                    GROUP BY 
                        code_plastic.code`,
                    params.params
                );

                if (select && select.length > 0)
                    data[i - 1] = select;
            }

            if (data && data.length > 0) {
                console.info(data)
                res.json({ code: 0, data: data })
            } else {
                res.json({ code: 1, message: "No data fetched" })
            }
        } catch (error) {
            console.error(error)
            res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
        }
    }


    async balleTotaliComplessive(req, res) {
        try {
            const { implant } = req.body;
            const params = implant;

            const [select] = await this.db.query(
                `SELECT 
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
                    AND presser_bale.id_rei = 1`,
                params
            );

            if (select && select.length > 0) {
                console.info(select)
                res.json({ code: 0, data: select });
            } else {
                res.json({ code: 1, message: "No data fetched" });
            }

        } catch (error) {
            console.error(error);
            res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`);
        }
    }

    async reportContatori(req, res) {
        try {
            const { implant } = req.body;
            const param = implant;

            const cont_plastic = await this.db.query(
                `SELECT 
                    code_plastic.code AS 'name', 
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
                    AND presser_bale.id_rei = 1
                GROUP BY 
                    code_plastic.code
                LIMIT 100`,
                param
            );

            const utiliz_rei = await this.db.query(
                `SELECT 
                    rei.name,
                    COUNT(pb_wb.id_pb) AS "totale_balle"
                FROM 
                    rei
                LEFT JOIN presser_bale 
                ON presser_bale.id_rei = rei.id
                LEFT JOIN pb_wb 
                ON pb_wb.id_pb = presser_bale.id
                LEFT JOIN wheelman_bale
                ON pb_wb.id_wb = wheelman_bale.id
                WHERE 
                    pb_wb.id_implant = ?
                GROUP BY 
                    rei.id
                ORDER BY
                    rei.id
                LIMIT 100`,
                param
            );

            const cond_pres = await this.db.query(
                `SELECT 
                    cond_presser_bale.type AS 'name',
                    COUNT(pb_wb.id_pb) AS "totale_balle"
                FROM 
                    cond_presser_bale
                LEFT JOIN presser_bale 
                ON presser_bale.id_cpb= cond_presser_bale.id
                LEFT JOIN pb_wb 
                ON pb_wb.id_pb = presser_bale.id
                LEFT JOIN wheelman_bale
                    ON pb_wb.id_wb = wheelman_bale.id
                WHERE 
                    pb_wb.id_implant = ?
                GROUP BY 
                    cond_presser_bale.id
                ORDER BY
                    cond_presser_bale.id
                LIMIT 100`,
                param
            );

            const cond_wheel = await this.db.query(
                `SELECT 
                    cond_wheelman_bale.type AS 'name',
                    COUNT(pb_wb.id_wb) AS "totale_balle"
                FROM 
                    cond_wheelman_bale
                LEFT JOIN wheelman_bale 
                ON wheelman_bale.id_cwb = cond_wheelman_bale.id
                LEFT JOIN pb_wb 
                ON pb_wb.id_wb = wheelman_bale.id
                LEFT JOIN presser_bale
                ON pb_wb.id_pb = presser_bale.id
                WHERE 
                    pb_wb.id_implant = ?
                GROUP BY 
                    cond_wheelman_bale.id
                ORDER BY
                    cond_wheelman_bale.id
                LIMIT 100`,
                param
            );

            const sel_bale = await this.db.query(
                `SELECT 
                    selected_bale.name,
                    COUNT(pb_wb.id_pb) AS "totale_balle"
                FROM 
                    selected_bale
                LEFT JOIN presser_bale 
                ON presser_bale.id_sb = selected_bale.id
                LEFT JOIN pb_wb 
                ON pb_wb.id_pb = presser_bale.id
                LEFT JOIN wheelman_bale
                ON pb_wb.id_wb = wheelman_bale.id
                WHERE 
                pb_wb.id_implant = ?
                GROUP BY 
                    selected_bale.id
                ORDER BY
                    selected_bale.id
                LIMIT 100`,
                param
            );

            const sel_warehouse = await this.db.query(
                `SELECT 
                    warehouse_dest.name,
                    COUNT(pb_wb.id_wb) AS "totale_balle"
                FROM 
                    warehouse_dest
                LEFT JOIN wheelman_bale 
                ON wheelman_bale.id_wd = warehouse_dest.id
                LEFT JOIN pb_wb 
                ON pb_wb.id_wb = wheelman_bale.id
                LEFT JOIN presser_bale
                ON pb_wb.id_pb = wheelman_bale.id
                WHERE 
                pb_wb.id_implant = ?
                GROUP BY 
                    warehouse_dest.id
                ORDER BY
                    warehouse_dest.id
                LIMIT 100`,
                param        
            );

            const motivation = await this.db.query(
                `SELECT 
                    reas_not_tying.name,
                    COUNT(pb_wb.id_wb) AS "totale_balle"
                FROM 
                    reas_not_tying
                LEFT JOIN wheelman_bale 
                ON wheelman_bale.id_wd = reas_not_tying.id
                LEFT JOIN pb_wb 
                ON pb_wb.id_wb = wheelman_bale.id
                LEFT JOIN presser_bale
                ON pb_wb.id_pb = presser_bale.id
                WHERE 
                    pb_wb.id_implant = ?
                GROUP BY 
                    reas_not_tying.id
                ORDER BY
                    reas_not_tying.id
                LIMIT 100`,
                param
            );

            if (motivation && sel_warehouse && sel_bale && cond_wheel && cond_pres && utiliz_rei && cont_plastic) {
                res.json({ code: 0, data: { motivation, sel_warehouse, sel_bale, cond_wheel, cond_pres, utiliz_rei, cont_plastic } })
            } else {
                res.json({ code: 1, message:"something went wrong" })
            }

        } catch (error) {
            console.error(error)
            res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
        }
    }

    /**
     * TODO
     * Creare una funzione che accetti come body due parametri: { nome_tabella: "<nome_tabella>", tipo: "" }
     * con il nome della tabella sarà possibile andare ad inserire dinamicamente la ricerca dei dati.
     * 
     * const { body } = req.body;
     * 
     * SELECT * FROM ${body.nome_tabella}
     */

    async reportDinamico(req, res) {
        try {
            const { implant } = req.body;
    
            // Parametro per la query
            const param = implant;
    
            // Query SQL per ottenere il totale delle balle per ogni tipo di plastica
            const [select] = await this.db.query(
                `SELECT 
                    code_plastic.code AS 'name', 
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
                    AND presser_bale.id_rei = 1
                GROUP BY 
                    code_plastic.code`, 
                [param]
            );
    
            if (select && select.length > 0) {
                res.json({ code: 0, data: select });
            } else {
                res.json({ code: 1, message: "No data fetched" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send(`Errore durante l'esecuzione della query: ${error}`);
        }
    }
}

export default Report