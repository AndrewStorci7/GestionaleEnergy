const Console = require('../../inc/console');

const console = new Console("Common");

/**
 * 
 * @param {object}      db  Oggetto che contiene la connessione e configurazione con il database
 * @param {string|int}  id  Identificativo dell'oggetto
 * 
 * @author Andrea Storci form Oppimittinetworking
 */
class Common {

    constructor(db, id) {
        this.db = db;
        this.id = id;
    }

    checkTurn() {
        const rangeTime = new Date()
        const _hour = rangeTime.getHours();

        if (_hour >= 6 && _hour < 14)
            return "BETWEEN '06:00:00' AND '13:59:59'";
        else if (_hour >= 14 && _hour < 22)
            return "BETWEEN '14:00:00' AND '21:59:59'";
        else if (_hour >= 22 && _hour < 6)
            return "BETWEEN '22:00:00' AND '05:59:59'";
        else
            return "";
    }
}

module.exports = Common

