const Common = require('./common');
const Console = require('../../inc/console');

const console = new Console("Bale");

/**
 * 
 * @author Andrea Storci form Oppimittinetworking
 * 
 * @param {datetime}    datetime    DataTime
 * @param {string}      idUser      Id of user
 */
class Bale extends Common {

    constructor(db, table, idUser, datetime) {
        super(db, table, idUser);
        // this.db = db;
        // this.idUser = idUser;
        this.datetime = datetime;
    }

    get info() {
        return { datetime: this.datetime, idUser: this.idUser };
    }

    checkTurn() {
        const rangeTime = new Date()
        const _hour = rangeTime.getHours();

        if (_hour >= 6 && _hour < 14)
            return "BETWEEN '06:00:00' AND '13:59:59'";
        else if (_hour >= 14 && _hour < 22)
            return "BETWEEN '14:00:00' AND '21:59:59'";
        else if ((_hour >= 22 && _hour <= 24) || (_hour >=24 && _hour < 6))
            return "BETWEEN '22:00:00' AND '23:59:59' OR BETWEEN '00:00:00' AND '05:59:59'";
        else
            return "BETWEEN '22:00:00' AND '23:59:59' OR BETWEEN '00:00:00' AND '05:59:59'";
    }

    /**
     * 
     * @param {Object} obj      Oggetto ricevuto tramite richiesta 
     * @param {Object} options  Opzioni facoltative per la gestione dell'update
     * 
     * @returns {Object} 
     */
    checkParams(obj, options) {
        if (options === null)
            throw new Error("No Table was defined")

        if (obj !== null && obj !== undefined) {
            if (typeof obj === 'object') {
                // console.info("Object detected")

                const table = options.table;
                var query = this.selectQuery(options)
                var columns = []
                var params = []
                
                // Creo un array con solo i valori diversi da "" (vuoto o null)
                // Differenzio per evitare casini nella creazione della stringa per la query
                for (const [key, value] of Object.entries(obj)) {
                    if (value !== '' && value !== 0 && (value !== 'undefined' || value !== undefined)) {
                        columns.push(key)
                        params.push(value)
                        if (table === "pb_wb" && key === "where")
                            params.push(value)
                    }
                }

                // console.info(params)

                // Creo correttamente la query
                for (const [index, val] of Object.entries(columns)) {
                    if (index < columns.length - 2)
                        query += `${val}=?, `
                    else 
                        query += (val !== 'where') ? `${val}=? ` : `WHERE ${(table === "pb_wb") ? "id_pb=? OR id_wb=?": "id=?"}`
                }

                // console.info(query)

                return { query, params }
            } else {
                return obj
            }
        } else {
            return null
        }
    }

    /**
     * Select query only for UPDATE and DELETE 
     * 
     * @param {object} options  
     */
    selectQuery(options) {
        switch (options.scope) {
            case "delete": {
                return `DELETE FROM ${options.table} WHERE `
            }
            case "update": {
                return `UPDATE ${options.table} SET ` 
            }
        }
    }
}

module.exports = Bale;