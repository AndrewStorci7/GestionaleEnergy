/**
 * Getter of the Key from .env file
 * 
 * @param {string} key 
 * @returns Environment Key
 */

const getEnv = (key, defaultvalue = "") => process.env[key] || defaultvalue;

export default getEnv;