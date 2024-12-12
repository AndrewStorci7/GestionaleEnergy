const Common = require('./common');
const Console = require('../../inc/console');

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

module.exports = Bale;