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
        // VECCHIA VERSIONE
        // if (_hour >= 6 && _hour < 14)
        //     return ['06:00:00', '13:59:59', 0];
        // else if (_hour >= 14 && _hour < 22)
        //     return ['14:00:00', '21:59:59', 0];
        // else if ((_hour >= 22 && _hour < 24) || (_hour >= 0 && _hour < 6))
        //     return ['22:00:00', '23:59:59', '00:00:00', '05:59:59', 1];

        if (_hour >= 6 && _hour < 14)
            return ['06:00:00', '13:59:59', 0];
        else if (_hour >= 14 && _hour < 22)
            return ['14:00:00', '21:59:59', 0];
        else if (_hour >= 22 && _hour < 24)
            return ['22:00:00', '23:59:59', 1];
        else if (_hour >= 0 && _hour < 6)
            return ['22:00:00', '23:59:59', '00:00:00', '05:59:59', 2];
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
     * Funzione migliorata per la gestione dei parametri SQL
     * @param {Object} obj      Oggetto ricevuto tramite richiesta 
     * @param {Object} options  Opzioni facoltative per la gestione dell'update
     * @returns {Object} 
     */
    checkParams(obj, options) {
        if (options === null)
            throw new Error("No Table was defined");

        if (obj !== null && obj !== undefined) {
            if (typeof obj === 'object') {
                const table = options.table;
                let query = this.selectQuery(options);
                let columns = [];
                let params = [];
                
                console.debug(`Input object: ${JSON.stringify(obj)}`);
                
                // Validazione e sanitizzazione dei parametri
                for (const [key, value] of Object.entries(obj)) {
                    if (this.isValidValue(value)) {
                        columns.push(key);
                        
                        // Converti appropriatamente i valori
                        let sanitizedValue = this.sanitizeValue(value);
                        params.push(sanitizedValue);
                        
                        // Gestione speciale per la tabella pb_wb
                        if (table === "pb_wb" && key === "where") {
                            params.push(sanitizedValue);
                        }
                    }
                }

                console.debug(`Processed columns: ${JSON.stringify(columns)}`);
                console.debug(`Processed params: ${JSON.stringify(params)}`);

                // Costruzione query migliorata
                for (let i = 0; i < columns.length; i++) {
                    const col = columns[i];
                    
                    if (col === 'where') {
                        // Gestione della clausola WHERE
                        query += `WHERE ${table}.id = ?`;
                    } else {
                        // Gestione delle colonne SET
                        query += `${col} = ?`;
                        if (i < columns.length - 1 && columns[i + 1] !== 'where') {
                            query += ', ';
                        } else if (i < columns.length - 1) {
                            query += ' ';
                        }
                    }
                }

                console.debug(`Final query: ${query}`);
                console.debug(`Final params: ${JSON.stringify(params)}`);

                return { query, params };
            } else {
                return obj;
            }
        } else {
            return null;
        }
    }

    /**
     * Verifica se un valore è valido per l'inserimento nel database
     * @param {any} value 
     * @returns {boolean}
     */
    isValidValue(value) {
        // Accetta 0 come valore valido per i numeri
        if (value === 0) return true;
        
        // Rifiuta valori null, undefined, stringa vuota
        if (value === null || value === undefined || value === '') return false;
        
        // Rifiuta la stringa 'undefined'
        if (value === 'undefined') return false;
        
        return true;
    }

    /**
     * Sanitizza un valore per l'inserimento nel database
     * @param {any} value 
     * @returns {any}
     */
    sanitizeValue(value) {
        // Gestione dei numeri
        if (typeof value === 'number') {
            return value;
        }
        
        // Gestione delle stringhe
        if (typeof value === 'string') {
            return value.trim();
        }
        
        // Gestione dei boolean
        if (typeof value === 'boolean') {
            return value ? 1 : 0;
        }
        
        // Per altri tipi, converti in stringa
        return String(value);
    }

    /**
     * Select query only for UPDATE, DELETE 
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
            default: {
                throw new Error(`Scope non valido: ${options.scope}`);
            }
        }
    }

    formatDate(date) {
        // console.debug("Data ricevuta ===> " + date);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    /**
     * Questa funzione serve per settare la corretta condizione di ricerca basata sull'orario (per turni)
     * Ritorna un oggetto utilizzabile per l'esecuzione di una query.
     * 
     * @param {number} id_implant    Id dell'impianto
     * @param {string} type          Tipo di condizione  
     * @param {number} turnIndex     Numero del turno per la condizione (delego a `checkTurn()`)
     * @param {string} dateForReport Data per il report
     * @returns {Object} 
     * ```js
     * {
     *      `condition`: condizione del where
     *      `params`: array con parametri per la query
     * }
     * ```
     */
    checkConditionForTurn(id_implant, type = null, turnIndex = 0, dateForReport = null) {
        const turn = this.checkTurn(turnIndex);

        const check = (dateForReport === null);
        var year, month, day, currentDate = new Date(), tomorrow = new Date(), yesterday = new Date();

        if (!check) {
            [year, month, day] = dateForReport.split('-').map(Number);
            const cd = new Date(year, month - 1, day);
            const tm = new Date(year, month - 1, day + 1);
            currentDate = this.formatDate(cd); // 'YYYY-MM-DD'
            tomorrow = this.formatDate(tm); // 'YYYY-MM-DD'
            // console.debug(currentDate, tomorrow);
        } else {
            currentDate = new Date();
            yesterday = new Date();
            yesterday.setDate(currentDate.getDate() - 1);
            yesterday = this.formatDate(yesterday);
            currentDate = this.formatDate(currentDate);
        }

        var condition = `(DATE(presser_bale.data_ins) = ${!check ? `'${tomorrow}'` : 'CURDATE()'} 
                        AND TIME(presser_bale.data_ins) BETWEEN ? AND ? )`;
        var params = [id_implant, turn[0], turn[1]];

        // Diffrenzio il ritrono della funzioni per tipo di chiamata
        // Nel caso in cui la chiamata sia per il report allora construisco un oggetto con condizioni separate
        if (type === "report") {
            condition = {
                first: `AND ((presser_bale.id_rei = 1 OR presser_bale.id_rei = 2) OR presser_bale.id_rei IS NULL) `,
                second: `AND DATE(presser_bale.data_ins) = ${!check ? `'${currentDate}'` : 'CURDATE() - INTERVAL 1 DAY'} AND TIME(presser_bale.data_ins) BETWEEN ? AND ? `,
                third: `AND (pb_wb.id_implant = ? OR pb_wb.id_implant IS NULL) AND pb_wb.status = 1`,
                fourth: `AND (wheelman_bale.id_cwb = 1 AND wheelman_bale.id_wd != 2)`,
            };
            params = [turn[0], turn[1], id_implant];
        }

        if (turn[turn.length - 1] !== 0) {

            const turn3_a = `${check ? yesterday : currentDate} 22:00:00`;
            const turn3_b = `${check ? currentDate : tomorrow} 05:59:59`;

            if (turn[turn.length - 1] == 1) {
                condition = `(DATE(presser_bale.data_ins) = ${!check ? `'${tomorrow}'` : 'CURDATE()'} AND 
                            TIME(presser_bale.data_ins) BETWEEN ? AND ? )`
                params = [id_implant, turn[0], turn[1]];
            }

            if (turn[turn.length - 1] == 2) {
                condition = `presser_bale.data_ins BETWEEN ? AND ? `
                params = [id_implant, turn3_a, turn3_b];
            }

            // Diffrenzio il ritrono della funzioni per tipo di chiamata
            // Nel caso in cui la chiamata sia per il report allora construisco un oggetto con condizioni separate
            if (type === "report") {
                condition = {
                    first: `AND ((presser_bale.id_rei = 1 OR presser_bale.id_rei = 2) OR presser_bale.id_rei IS NULL) `,
                    second: `AND (presser_bale.data_ins BETWEEN ? AND ? )`,
                    third: `AND (pb_wb.id_implant = ? OR pb_wb.id_implant IS NULL) AND pb_wb.status = 1`,
                    fourth: `AND (wheelman_bale.id_cwb = 1 AND wheelman_bale.id_wd != 2)`,
                };
                params = [turn3_a, turn3_b, id_implant];
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

    async getIdsBale(id) {
        try {
            if (id === 0 || id === undefined || id === null) {
                return { code: 1, message: "ID non specificato" };
            }

            const [select] = await this.db.query(
                `SELECT 
                    pb_wb.id,
                    pb_wb.id_pb,
                    pb_wb.id_wb
                FROM 
                    pb_wb 
                WHERE 
                    pb_wb.id = ?`,
                [id]
            );
    
            if (select) {
                return { code: 0, data: select };
            } else {
                return { code: 1, message: "Nessuna balla trovata con questo ID" };
            }
        } catch (error) {
            return { code: 1, message: `Errore all'interno di getIdsBale(): ${error.message}` };
        }
    }
}

export default Common;

