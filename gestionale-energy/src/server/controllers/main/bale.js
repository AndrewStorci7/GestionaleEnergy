import Common from './common.js';
import Console from '../../inc/console.js';

const console = new Console("Bale");

/**
 * 
 * @author Andrea Storci form Oppimittinetworking
 * 
 * @param {datetime}    datetime    DataTime
 * @param {string}      idUser      Id of user
 */
class Bale extends Common {
    constructor(db, table) {
        super(db, table);
    }

    checkTurn() {
        const rangeTime = new Date()
        const _hour = rangeTime.getHours();

        if (_hour >= 6 && _hour < 14) return "BETWEEN '06:00:00' AND '13:59:59'";
        else if (_hour >= 14 && _hour < 22) return "BETWEEN '14:00:00' AND '21:59:59'";
        else if ((_hour >= 22 && _hour <= 24) || (_hour >=24 && _hour < 6)) return "BETWEEN '22:00:00' AND '23:59:59' OR BETWEEN '00:00:00' AND '05:59:59'";
        else return "BETWEEN '22:00:00' AND '23:59:59' OR BETWEEN '00:00:00' AND '05:59:59'";
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
                
                // Validazione e sanitizzazione dei parametri
                for (const [key, value] of Object.entries(obj)) {
                    // Migliore validazione dei valori
                    if (this.isValidValue(value)) {
                        columns.push(key);
                        
                        // Converti appropriatamente i valori
                        let sanitizedValue = this.sanitizeValue(value);
                        if (key !== 'data_ins') params.push(sanitizedValue);
                        
                        // Gestione speciale per la tabella pb_wb
                        if (table === "pb_wb" && key === "where") {
                            params.push(sanitizedValue);
                        }
                    }
                }

                console.debug(`Columns: ${JSON.stringify(columns)}`);
                console.debug(`Params before query construction: ${JSON.stringify(params)}`);

                // Costruzione query migliorata
                for ( let i = 0; i < columns.length; ++i ) {
                    const col = columns[i];
                    
                    if (col === 'where') {
                        // Gestione della clausola WHERE
                        query += "WHERE id = ?";
                    } else {
                        // Gestione delle colonne SET
                        console.log(`col ===> ${col}`)
                        query += col === 'data_ins' ? `data_ins = CURRENT_TIMESTAMP()` : `${col} = ?`;
                        
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
     * Select query only for UPDATE and DELETE 
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
}

export default Bale;