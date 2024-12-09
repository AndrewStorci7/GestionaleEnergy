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
}

module.exports = Common

