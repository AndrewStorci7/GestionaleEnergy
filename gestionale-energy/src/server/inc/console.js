const _reset = '\x1b[0m';
const _red = '\x1b[31m';
const _green = '\x1b[32m';
const _yellow = '\x1b[33m';
const _blue = '\x1b[34m';
const _cyan = '\x1b[36m';
const _padEnd = 16;

const _CMN_TEXT_ERROR = ""

/**
 * @param {number} level    Tipologie di livelli:
 * - `1`: Debug, 
 * - `2`: No Info, only errors
 * - `3`: Info
 */
class Console {

    constructor(fileName, lvl = 2) {
        this.location = fileName;
        this.level = lvl;
    }

    /**
     * Get caller line and file
     * @returns {string}
     */
    getCallerInfo() {
        const stack = new Error().stack.split("\n");
        const caller = stack[3];
        const match = caller.match(/\((.*?):(\d+):(\d+)\)/);
        if (match) {
            const [, file, line] = match;
            return `${file}:${line}`;
        }
        return "unknown location";
    }

    /**
     * Correctly Print a circular object avoiding recursion
     *  
     * @param {*} obj 
     * @returns 
     */
    safeStringify(obj) {
        const seen = new Set();
        return JSON.stringify(obj, (key, value) => {
            if (typeof value === "object" && value !== null) {
                if (seen.has(value)) {
                    return "[Circular]";
                }
                seen.add(value);
            }
            return value;
        }, 2); // Indenta di 2 spazi
    }

    /**
     * 
     * @param {string} str 
     */
    ws(str, ip) {
        var date = new Date();
        var ret = `[${date.toLocaleString()}][${_yellow} ${this.location.padEnd(_padEnd)} ${_reset}][${_green} ${'Connection'.padEnd(3)} ${_reset}]: `;
        let msg = "new user connected to the server";
        let ip_str = "";
        
        if (typeof ip === 'string' && ip)
            ip_str = `${_cyan}${ip}${_reset}`;

        if (str != "undefined" || str != null || str != "") {
            // msg = `${_green}${str}${_reset}`;
            msg = str + ip_str;
            console.log(ret + msg);
        }
    }
    
    /**
     * 
     * @param {string} str 
     */
    conn(str) {
        var date = new Date()
        var ret = `[${date.toLocaleString()}][${_yellow} ${this.location.padEnd(_padEnd)} ${_reset}][${_green} ${'Connection'.padEnd(3)} ${_reset}]: `;
        let msg = "New user connected to the server"

        if (str != "undefined" || str != null || str != "") {
            let count = 0;
            let stringInterpreted;
            for ( let i = 0; i < str.length; ++i ) {
                if (str[i] === '*' && count === 0) {
                    stringInterpreted += _cyan;
                    ++count;
                } else if (str[i] === '*' && count === 1) {
                    stringInterpreted += _reset;
                    count = 0;
                } else {
                    stringInterpreted += str[i];
                }
            }
            msg = `${_reset}${stringInterpreted}${_reset}`;
        }

        console.log(ret + msg);
    } 

    /**
     * 
     * @param {string} str 
     */
    wsMessage(str) {
        var date = new Date()
        var ret = `[${date.toLocaleString()}][${_yellow} ${this.location.padEnd(_padEnd)} ${_reset}][${_blue} ${'WS Message'.padEnd(3)} ${_reset}]: `;
        let msg = "new user connected to the server"
        if (str != "undefined" || str != null || str != "") {
            msg = `${_blue}${str}${_reset}`;
        }

        console.log(ret + msg);
    }

    /**
     * Display Error
     * @param {any} str 
     */
    error(str) {
        var date = new Date()
        var callerInfo = this.getCallerInfo();
        var ret = (this.level !== 3) ? `[${date.toLocaleString()}][${_yellow} ${this.location.padEnd(_padEnd)} ${_reset}][${_red} ${'Error'.padEnd(3)} ${_reset}][${callerInfo}]: ` : `[${_red} ${'Error'.padEnd(3)} ${_reset}]: `;
        let msg = "Generic error"
        if (str != "undefined" || str != null || str != "") {
            msg = `${_red}\n${str}${_reset}`;
        }

        console.log(ret + msg);
    }

    debug(str, color = "") {
        if (process.env.NODE_ENV === "development") {
            const fontColor = this.getColor(color);
            const date = new Date();
            const callerInfo = this.getCallerInfo();
            const ret = (this.level === 1) ? `[${date.toLocaleString()}][${_yellow} ${this.location.padEnd(_padEnd)} ${_reset}][${_cyan} DEBUG ${_reset}][${callerInfo}]: ${fontColor}` : `[${_cyan} DEBUG ${_reset}]: `;
            let msg = "Generic Info" + _reset;
            if (str != "undefined" || str != null) {
                if (typeof str === "object")
                    msg = `${this.safeStringify(str)} ${_reset}`;
                else msg = `${str} ${_reset}`;
            }

            console.log(ret + msg);
        } else {
            console.log("salamaleku");
        }
    }

    /**
     * Dispaly Info
     * @param {any}     str 
     * @param {string}  color
     */
    info(str, color = "") {
        if (this.level !== 2) {
            const fontColor = this.getColor(color);
            const date = new Date();
            const callerInfo = this.getCallerInfo();
            const ret = (this.level !== 3) ? `[${date.toLocaleString()}][${_yellow} ${this.location.padEnd(_padEnd)} ${_reset}][${_cyan} ${'Info'.padEnd(3)} ${_reset}][${callerInfo}]: ${fontColor}` : `[${_cyan} ${'Info'.padEnd(3)} ${_reset}]: `;
            let msg = "Generic Info" + _reset;
            if (str != "undefined" || str != null) {
                if (typeof str === "object")
                    msg = `${this.safeStringify(str)} ${_reset}`;
                else msg = `${str} ${_reset}`;
            }

            console.log(ret + msg);
        }
    }


    /**
     * Dispaly Log
     * @param {any}     str 
     * @param {string}  color
     */
    log(str, color = "") {
        this.info(str, color);
    }

    /**
     * Display status insertion
     * @param {any} str
     */
    insert(str) {
        var date = new Date()
        var callerInfo = this.getCallerInfo();
        var ret = `[${date.toLocaleString()}][${_yellow} ${this.location.padEnd(_padEnd)} ${_reset}][${_green} ${'Success'.padEnd(3)} ${_reset}][${callerInfo}]: `;
        let msg = `${_green}Insert Info${_reset}: `
        if (str != "undefined" || str != null || str != "") {
            if (typeof str === "object")
                msg = `${this.safeStringify(str)}`;
            else msg = `${str}`;
        }

        console.log(ret + msg);
    }

    /**
     * Display status delete
     * @param {any} str
     */
    delete(str) {
        const date = new Date()
        const callerInfo = this.getCallerInfo();
        const ret = `[${date.toLocaleString()}][${_yellow} ${this.location.padEnd(_padEnd)} ${_reset}][${_blue} ${'Delete'.padEnd(3)} ${_reset}][${callerInfo}]: `;
        let msg = `${_blue}Delete Info${_reset}: `
        if (str != "undefined" || str != null || str != "") {
            if (typeof str === "object")
                msg = `${this.safeStringify(str)}`;
            else msg = `${str}`;
        }

        console.log(ret + msg);
    }

    /**
     * Get color for text
     * @param {string} color
     * @return {string}
     */
    getColor(color = "") {
        switch (color) {
            case "blue" || "blu":
                return _blue;
            case "red" || "rosso":
                return _red;
            case "yellow" || "giallo":
                return _yellow;
            case "cyan" || "ciano":
                return _cyan;
            case "green" || "verde":
                return _green;
            default:
                return _blue;
        }
    }

    /// TODO
    /// Create a funztion that colorize string [QUERY] and [PARAMS]
    // databaseQuery(str) {

    // }

}

export default Console