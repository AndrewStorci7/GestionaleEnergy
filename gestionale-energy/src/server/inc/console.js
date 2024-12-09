const _reset = '\x1b[0m';
const _red = '\x1b[31m';
const _green = '\x1b[32m';
const _yellow = '\x1b[33m';
const _blue = '\x1b[34m';
const _cyan = '\x1b[36m';

const _CMN_TEXT_ERROR = ""

class Console {

    constructor(fileName, lvl = 1) {
        this.location = fileName;
        this.level = lvl;
    }

    /**
     * Display Error
     * @param {any} str 
     */
    error(str) {
        var date = new Date()
        var ret = `[${date.toLocaleString()}][ ${this.location} ]\t[${_red} Error ${_reset}]: `;
        let msg = "Generic error"
        if (str != "") {
            msg = `${str}`;
            // console.log(`${Date.now()} [ ${this.location} ][${_red} Error ${_reset}]: \n${str}`)
        }

        console.log(ret + msg);
    }

    /**
     * Dispaly Info
     * @param {any} str 
     */
    info(str) {
        var date = new Date()
        var ret = `[${date.toLocaleString()}][ ${this.location} ]\t[${_cyan} Info ${_reset}]: `;
        let msg = "Generic Info"
        if (str != "") {
            msg = `${str}`;
            // console.log(`${Date.now()} [ ${this.location} ][${_red} Error ${_reset}]: \n${str}`)
        }

        console.log(ret + msg);
    }

    /**
     * Display status insertion
     * @param {any} str
     */
    insert(str) {
        var date = new Date()
        var ret = `[${date.toLocaleString()}][ ${this.location} ]\t[${_green} Success ${_reset}]: `;
        let msg = `${_green}Insert Info${_reset}: `
        if (str != "") {
            msg += `${str}`;
            // console.log(`${Date.now()} [ ${this.location} ][${_red} Error ${_reset}]: \n${str}`)
        }

        console.log(ret + msg);
    }

    /**
     * Display status delete
     * @param {any} str
     */
    delete(str) {
        var date = new Date()
        var ret = `[${date.toLocaleString()}][ ${this.location} ]\t[${_blue} Success ${_reset}]: `;
        let msg = `${_blue}Delete Info${_reset}: `
        if (str != "") {
            msg += `${str}`;
            // console.log(`${Date.now()} [ ${this.location} ][${_red} Error ${_reset}]: \n${str}`)
        }

        console.log(ret + msg);
    }

}

module.exports = Console