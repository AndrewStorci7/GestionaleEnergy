const Console = require('../inc/console')

const console = new Console("Login")

/**
 * Login Route handler
 * 
 * @param {string} username
 * @param {int}    type    
 * 
 * @author Andrea Storci from Oppimittinetworking
 */
class Login {

    constructor() {
        this.username = null;
        this.type = null;
    }

    async check(req, res) {
        try {
            const { username, password } = req.body;
            const [rows] = await db.query(`SELECT * FROM user WHERE user.username='${username}' AND user.password='${password}'`);
            if (rows && rows.length > 0) {
                res.json(rows)
            } else {
                res.json({ code: 1, message: "Credenziali errate" });
            }
        } catch (error) {
            console.error(error)
            res.status(500).send(`Errore durante l\'esecuzione della query: ${error}`)
        }
    }

    /**
     * Set User
     * @param {string} username 
     * @param {string} userType 
     */
    setUser(username, userType) {
        this.username = username;
        this.type = userType;
    }

    /**
     * Get User 
     * @returns {JSON}
     */
    getUser() {
        return { username: this.username, type: this.type };
    }

    /**
     * Set username
     * @param {*} username 
     */
    setUsername(username) {
        this.username = username;
    }

    /**
     * Set user type
     * @param {int} userType 
     */
    setUsertype(userType) {
        this.type = userType;
    }

    /**
     * Unsetter
     */
    clearUser() {
        this.username = null;
        this.type = null;
    }

}

module.exports = Login;