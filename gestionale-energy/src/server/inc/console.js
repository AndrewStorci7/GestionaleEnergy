const _reset = '\x1b[0m';
const _red = '\x1b[31m';
const _green = '\x1b[32m';
const _yellow = '\x1b[33m';
const _blue = '\x1b[34m';
const _cyan = '\x1b[36m';
const _padEnd = 16;

const _CMN_TEXT_ERROR = ""

class Console {

    constructor(fileName, lvl = 1) {
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
     * Display Error
     * @param {any} str 
     */
    error(str) {
        var date = new Date()
        var callerInfo = this.getCallerInfo();
        var ret = `[${date.toLocaleString()}][${_yellow} ${this.location.padEnd(_padEnd)} ${_reset}][${_red} ${'Error'.padEnd(3)} ${_reset}][${callerInfo}]: `;
        let msg = "Generic error"
        if (str != "undefined" || str != null || str != "") {
            msg = `${_red}\n${str}${_reset}`;
        }

        console.log(ret + msg);
    }

    /**
     * Dispaly Info
     * @param {any} str 
     */
    info(str) {
        var date = new Date()
        var callerInfo = this.getCallerInfo();
        var ret = `[${date.toLocaleString()}][${_yellow} ${this.location.padEnd(_padEnd)} ${_reset}][${_cyan} ${'Info'.padEnd(3)} ${_reset}][${callerInfo}]: `;
        let msg = "Generic Info"
        if (str != "undefined" || str != null) {
            if (typeof str === "object")
                msg = `${this.safeStringify(str)}`;
            else msg = `${str}`;
        }

        console.log(ret + msg);
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
        var date = new Date()
        var callerInfo = this.getCallerInfo();
        var ret = `[${date.toLocaleString()}][${_yellow} ${this.location.padEnd(_padEnd)} ${_reset}][${_blue} ${'Delete'.padEnd(3)} ${_reset}][${callerInfo}]: `;
        let msg = `${_blue}Delete Info${_reset}: `
        if (str != "undefined" || str != null || str != "") {
            if (typeof str === "object")
                msg = `${this.safeStringify(str)}`;
            else msg = `${str}`;
        }

        console.log(ret + msg);
    }

}

module.exports = Console