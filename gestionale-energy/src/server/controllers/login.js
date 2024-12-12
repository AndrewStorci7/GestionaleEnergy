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