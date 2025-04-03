import Console from '../../inc/console.js';
import { 
    COND_ID_IMPLANT,
    COND_GET_TOTAL_BALE, 
    COND_GET_COUNT_PLASTIC_REPORT,
} from '../../inc/config.js';

const console = new Console("Common");

/**
 * 
 * @param {object}      db      Oggetto che contiene la connessione e configurazione con il database
 * @param {string|int}  id      Identificativo dell'oggetto
 * @param {string}      table   Nome della tabella
 * 
 * @author Andrea Storci form Oppimittinetworking
 */
class Common {

    constructor(db, table) {
        this.db = db;
        this.table = table;
        this.cond_for_idimplant = COND_ID_IMPLANT; // condizione per la selezion delle balle per un certo impianto
        this.cond_for_totbale = COND_GET_TOTAL_BALE; // condizione per selezionare tutte le balle (visualizzare)
        this.cond_for_cplastic = COND_GET_COUNT_PLASTIC_REPORT; // condizione per il conteggiare delle balle (report)  
    }

    /**
     * Funzione che ritorna il corretto range di TIME() per effettuare la ricerca corretta per turno
     * 
     * @param {number} turn { 1 | 2 | 3 } Denota il turno da selezionare
     * @returns 
     */
    checkTurn(turn = 0) {

        const rangeTime = new Date();
        var _hour = rangeTime.getHours();
        console.info("Ora calcolata: " + _hour);
        if (turn != 0) {
            // console.info(`Turno dentro checkTurn(): ${turn}`)
            if (turn != 1 && turn != 2 && turn != 3) {
                throw "errore: parametro turn non valido: deve essere uno tra questi valori {1, 2, 3}";
            } else {
                _hour = (turn === 1) ? 7 : (turn === 2) ? 15 : (turn === 3) ? 23 : rangeTime.getHours();
            } 
        }

        if (_hour >= 6 && _hour < 14)
            return ['06:00:00', '13:59:59', 0];
        else if (_hour >= 14 && _hour < 22)
            return ['14:00:00', '22:59:59', 0];
        else if ((_hour >= 22 && _hour <= 24) || (_hour >= 24 && _hour < 6))
            return ['23:00:00', '23:59:59', '00:00:00', '05:59:59', 1];
    }

    convertSpecialCharsToHex(inputString) {
        if (!inputString) return '';
    
        return inputString.split('').map(char => {
            const charCode = char.charCodeAt(0);
            
            if (!/[a-zA-Z0-9]/.test(char)) {
                return `\\x${charCode.toString(16).padStart(2, '0')}`;
            }
            return char;
        }).join('');
    }

    /**
     * Funzione che crea e adatta la query per l'UPDATE o DELETE query sul DB
     * 
     * @param {Object} obj      Oggetto ricevuto tramite richiesta 
     * @param {Object} options  Opzioni facoltative per la gestione dell'update
     * 
     * @returns {Object} 
     */
    checkParams(obj, options) {
        if (options === null)
            throw new Error("No Table was defined");

        if (obj !== null && obj !== undefined) {
            if (typeof obj === 'object') {

                const table = options.table;
                var query = this.selectQuery(options)
                var columns = []
                var params = []
                
                // Creo un array con solo i valori diversi da "" (vuoto o null)
                // Differenzio per evitare casini nella creazione della stringa per la query
                for (const [key, value] of Object.entries(obj)) {
                    if (value !== '' && value !== 0 && (value !== 'undefined' || value !== undefined)) {
                        columns.push(key);
                        params.push(value);
                        if (table === "pb_wb" && key === "where")
                            params.push(value);
                    }
                }

                // console.info(params)

                // Creo correttamente la query
                for (const [index, val] of Object.entries(columns)) {
                    if (index < columns.length - 2)
                        query += `${val}=?, `;
                    else 
                        query += (val !== 'where') ? `${val}=? ` : `WHERE ${(table === "pb_wb") ? "id_pb=? OR id_wb=?": "id=?"}`;
                }

                // console.info(query)

                return { query, params };
            } else {
                return obj
            }
        } else {
            return null
        }
    }

    /**
     * Select query only for UPDATE, DELETE 
     * 
     * @param {object} options  
     */
    selectQuery(options) {
        switch (options.scope) {
            case "delete": {
                return `DELETE FROM ${options.table} WHERE `;
            }
            case "update": {
                return `UPDATE ${options.table} SET `;
            }
        }
    }

    /**
     * Questa funzione serve per settare la corretta condizione di ricerca basata sull'orario (per turni)
     * Ritorna un oggetto utilizzabile per l'esecuzione di una query.
     * return {
     *      `condition`: condizione del where
     *      `params`: array con parametri per la query
     * }
     * 
     * @param {number} id_implant   Id dell'impianto
     * @param {string} type         Tipo di condizione  
     * @param {number} turnIndex    Numero del turno per la condizione (delego a `checkTurn()`)
     * 
     * @returns {Object} 
     */
    checkConditionForTurn(id_implant, type = null, turnIndex = 0) {
        const turn = this.checkTurn(turnIndex);

        var condition = `AND DATE(presser_bale.data_ins) = CURDATE() 
                        AND DATE(wheelman_bale.data_ins) = CURDATE() 
                        AND TIME(presser_bale.data_ins) BETWEEN ? AND ? 
                        AND TIME(wheelman_bale.data_ins) BETWEEN ? AND ? `;
        var params = [id_implant, turn[0], turn[1], turn[0], turn[1]];

        // Diffrenzio il ritrono della funzioni per tipo di chiamata
        // Nel caso in cui la chiamata sia per il report allora construisco un oggetto con condizioni separate
        if (type === "report") {
            condition = {
                first: `AND ((presser_bale.id_rei = 1 OR presser_bale.id_rei = 2) OR presser_bale.id_rei IS NULL) `,
                second: `AND DATE(presser_bale.data_ins) = CURDATE() AND TIME(presser_bale.data_ins) BETWEEN ? AND ? `,
                third: `AND (pb_wb.id_implant = ? OR pb_wb.id_implant IS NULL) `,
                fourth: `AND wheelman_bale.id_cwb = 1 AND DATE(wheelman_bale.data_ins) = CURDATE() AND TIME(wheelman_bale.data_ins) BETWEEN ? AND ? `,
            };
            params = [turn[0], turn[1], id_implant, turn[0], turn[1]];
        }

        if (turn[turn.length - 1] === 1) {
            condition = `AND ((DATE(presser_bale.data_ins) = CURDATE() AND DATE(wheelman_bale.data_ins) = CURDATE() AND TIME(presser_bale.data_ins) BETWEEN ? AND ? AND TIME(wheelman_bale.data_ins) BETWEEN ? AND ? ) OR (DATE(presser_bale.data_ins) = (CURDATE() + INTERVAL 1 DAY) AND DATE(wheelman_bale.data_ins) = (CURDATE() + INTERVAL 1 DAY) AND TIME(presser_bale.data_ins) BETWEEN ? AND ? AND TIME(wheelman_bale.data_ins) BETWEEN ? AND ? ))`;
            params = [id_implant, turn[0], turn[1], turn[0], turn[1], turn[2], turn[3], turn[2], turn[3]];

            // Diffrenzio il ritrono della funzioni per tipo di chiamata
            // Nel caso in cui la chiamata sia per il report allora construisco un oggetto con condizioni separate
            if (type === "report") {
                condition = {
                    first: `AND ((presser_bale.id_rei = 1 OR presser_bale.id_rei = 2) OR presser_bale.id_rei IS NULL) `,
                    second: `AND ((DATE(presser_bale.data_ins) = CURDATE() AND TIME(presser_bale.data_ins) BETWEEN ? AND ?) OR (DATE(presser_bale.data_ins) = (CURDATE() + INTERVAL 1 DAY) AND TIME(presser_bale.data_ins) BETWEEN ? AND ? )) `,
                    third: `AND (pb_wb.id_implant = ? OR pb_wb.id_implant IS NULL)`,
                    fourth: `AND wheelman_bale.id_cwb = 1 AND ((DATE(wheelman_bale.data_ins) = CURDATE() AND TIME(wheelman_bale.data_ins) BETWEEN ? AND ? ) OR (DATE(wheelman_bale.data_ins) = (CURDATE() + INTERVAL 1 DAY) AND TIME(wheelman_bale.data_ins) BETWEEN ? AND ? )) `,
                };
                params = [turn[0], turn[1], turn[2], turn[3], id_implant, turn[0], turn[1], turn[2], turn[3]];
            }
        }

        return { condition, params };
    }

    /**
     * ----------------------------------------------------------------------------------------
     *                          VERRA' UTILIZZATA PIU' AVANTI 
     * ----------------------------------------------------------------------------------------
     * Aggiorna l'id dell'impianto nel caso in cui ci sia una balla con `REI Altro Mag`
     * Al momento se l'ID dell'impianto di lavorazione è 1 (Impianto A) verrà convertito in 2 (Impianto B) e viceverse
     * 
     * @param {any}     params      Array con i parametri per la query
     * @param {number}  id_implant  ID dell'impianto di lavorazione
     */
    updateIdImplant(params, id_implant) {
        if (params !== null && id_implant !== 0) {
            // aggiorno l'id
            const updated_idImplant = id_implant == 1 ? 2 : 1;
            // lo aggiungo in seconda posizione 
            params.splice(1, 0, updated_idImplant);
        } else {
            throw new Error("Parametri non definiti {`params` e `id_implant`}"); 
        }
    }

    async prova(req, res) {
        try {
            const {body} = req.body;
            console.info(`stringa normale: ${body}`);
            const stringa = this.convertSpecialCharsToHex(body);
            console.info(`stringa convertita: ${stringa}`);
        } catch (error) {
            console.error(error);
            res.status(500);
        }
    }
}

export default Common

