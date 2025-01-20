/**
 * Getter of the Key from .env file
 * 
 * @param {*} key           [ 'srvurl' | 'srvport' ]
 * @param {*} defaultKey    
 * 
 * @returns Environment Key
 */

const getEnv = (key, defaultKey = "") => {

    switch (key) {
        case 'srvurl' || 'SRVURL': {
            return process.env.NEXT_PUBLIC_SERVER_URL;
        }
        case 'srvport' || 'SRVPORT': {
            return process.env.NEXT_PUBLIC_SERVER_PORT;
        }
        case 'domain' || 'DOMAIN': {
            return process.env.NEXT_PUBLIC_APP_DOMAIN;
        }
        case 'wsurl' || 'WSURL': {
            return process.env.NEXT_PUBLIC_WS_URL;
        }
        default: {
            return defaultKey;
        }
    }
};

/**
 * Getter of the server url 
 * 
 * @returns 
 */
const getSrvUrl = () =>  {

    const URL = getEnv('srvurl');
    const PORT = getEnv('srvport');
    const srvurl = `${URL}:${PORT}`;

    return srvurl
}

/**
 * Getter of the WebSocket url 
 * 
 * @returns 
 */
const getWsUrl = () => {
    
    const URL = getEnv('wsurl');
    const PORT = getEnv('srvport');
    const wsurl = `${URL}:${PORT}`;

    return wsurl
}

export { getEnv, getSrvUrl, getWsUrl };