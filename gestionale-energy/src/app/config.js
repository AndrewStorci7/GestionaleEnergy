/**
 * Getter of the Key from .env file
 * 
 * @param {*} key
 * @param {*} defaultKey 
 * 
 * @returns Environment Key
 */

const getEnv = (key, defaultKey = "") => {

    if (defaultKey !== "") {
        return defaultKey;
    }

    switch (key) {
        case 'srvurl' || 'SRVURL': {
            return process.env.NEXT_PUBLIC_SERVER_URL;
        }
        case 'srvport' || 'SRVPORT': {
            return process.env.NEXT_PUBLIC_SERVER_PORT;
        }
        default: {
            return undefined;
        }
    }
};

export default getEnv;