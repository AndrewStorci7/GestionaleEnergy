const Common = require('./common');
const Console = require('../inc/console');

const console = new Console("Bale");

/**
 * 
 * @param {datetime}    datetime    DataTime
 * @param {string}      idUser      Id of user
 * 
 * @author Andrea Storci form Oppimittinetworking
 */
class Bale extends Common {

    constructor(db, datetime, idUser) {
        super(db, idUser);
        // this.db = db;
        // this.idUser = idUser;
        this.datetime = datetime;
    }

    get info() {
        return { datetime: this.datetime, idUser: this.idUser };
    }
}

module.exports = Bale;