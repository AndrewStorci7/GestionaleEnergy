/**
 * Getter of the Key from .env file
 * 
 * @param {*} key           [ 'srvurl' | 'srvport' ]
 * @param {*} defaultKey    
 * 
 * @returns Environment Key
 */

const getEnv = (key, defaultKey = "") => {

    // if (defaultKey !== "") {
    //     return defaultKey;
    // }

    switch (key) {
        case 'srvurl' || 'SRVURL': {
            return process.env.NEXT_PUBLIC_SERVER_URL;
        }
        case 'srvport' || 'SRVPORT': {
            return process.env.NEXT_PUBLIC_SERVER_PORT;
        }
        case 'domain' || 'DOMAIN': {
            return process.env.NEXT_PUBLIC_APP_DOMAIN
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

export { getEnv, getSrvUrl };