/**
 * Getter of the Key from .env file
 * 
 * @param {*} key 
 * @returns Environment Key
 */

const getEnv = (key) => process.env[key];

export default getEnv;