const Console = require('../../inc/console');

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

    constructor(db, table, id) {
        this.db = db;
        this.table = table;
        this.id = id;
    }

    checkTurn() {
        const rangeTime = new Date()
        const _hour = rangeTime.getHours();

        if (_hour >= 6 && _hour < 14)
            return ['06:00:00', '13:59:59'];
        else if (_hour >= 14 && _hour < 22)
            return ['14:00:00', '21:59:59'];
        else if (_hour >= 22 && _hour < 6)
            return ['22:00:00', '05:59:59'];
        else
            return ['', ''];
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

    async prova(req, res) {
        try {
            const {body} = req.body 
            console.info(`stringa normale: ${body}`)
            const stringa = this.convertSpecialCharsToHex(body)
            console.info(`stringa convertita: ${stringa}`)
        } catch (error) {
            console.error(error)
            res.status(500)
        }
    }
}

module.exports = Common

