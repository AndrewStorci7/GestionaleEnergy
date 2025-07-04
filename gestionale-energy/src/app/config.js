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

    return srvurl;
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

    return wsurl;
}

/**
 * Get Background Color
 * 
 * @param {string} type 
 * @param {string} scope default: "header"
 * @returns 
 */
const getBgColor = (type, scope = "") => {
    switch (type) {
        case 'admin':
            return (scope === "header") ? "bg-primary" : (scope === "theader") ? "bg-primary" : "bg-primary_2";
        case 'presser':
            return (scope === "header") ? "bg-primary" : (scope === "theader") ? "bg-primary" : "bg-primary_2";
        case 'wheelman':
            return (scope === "header") ? "bg-secondary" : (scope === "theader") ? "bg-secondary" : "bg-secondary_2";
        case 'both':
            return (scope === "header") ? "bg-thirdary_1" : (scope === "theader") ? "bg-secondary" : "bg-secondary_2";
        default:
            return (scope === "header") ? "bg-primary" : (scope === "theader") ? "bg-primary" : "bg-primary_2";
    }
}

/**
 * Reload Server through Websocket
 * 
 * @param {object} ws WebSocket istance
 */
const refreshPage = (ws) => {
    if (isWebSocketConnected(ws)) {
        const message = JSON.stringify({ type: "reload", data: "___update___" })
        ws.current.send(message);
    } else {
        // console.log('WebSocket is not connected');
        throw new Error("Websocket non connesso");
    }
}

/**
 * Check if the websocket is connected
 * 
 * @param {object} ws WebSocket instance
 * @returns True id the websocket is connected
 */
const isWebSocketConnected = (ws) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        return true;
    } else {
        return false;
    }
}

//#region Server Routes
/**
 * Get the server route
 * @param {string} route 
 * @returns {string}
 */
const getServerRoute = (route) => {

    if (route === undefined)
        throw new Error("Undefined route (`route` cannot be empty)");

    switch (route) {

        case "status": return -1;

        //////////////////////////////////////////////////////
        // Rotte l'accesso e gestione dei dati di un utente
        case "login": return getSrvUrl() + "/login"; 
        
        //////////////////////////////////////////////////////
        // Rotte per le singole opzioni di ogni singolo campo dati
        case "plastic": return getSrvUrl() + "/plastic/get";
        case "cdbc": return getSrvUrl() + "/cdbc/get";
        case "cdbp": return getSrvUrl() + "/cdbp/get";
        case "dest-wh": return getSrvUrl() + "/dest-wh/get";
        case "rei": return getSrvUrl() + "/rei/get";
        case "selected-b": return getSrvUrl() + "/selected-b/get";
        case "implants": return getSrvUrl() + "/implants/get";
        case "reason": return getSrvUrl() + "/reason/get";
        
        //////////////////////////////////////////////////////
        // Rotte per la balla totale
        case "bale":
        case "balla": 
            return getSrvUrl() + "/bale/get";
        case "aggiungi-balla":
        case "add-bale": 
            return getSrvUrl() + "/bale/add";
        case "rimuovi-balla": 
        case "delete-bale": 
            return getSrvUrl() + "/bale/delete";
        case "aggiorna-stato-balla": 
        case "update-status-bale": 
            return getSrvUrl() + "/bale/status/update";
        case "totale-balle": 
        case "total-bale-count": 
            return getSrvUrl() + "/bale/total-count";
        case "totale-chili":
        case "total-kilos": 
            return getSrvUrl() + "/bale/total-chili";
        case "id-balla": 
        case "id-bale": 
            return getSrvUrl() + "/bale/id";
        case "update-bale": 
        case "update-bale-data":
            return getSrvUrl() + "/bale/update";
        
        //////////////////////////////////////////////////////
        // Rotte per la gestione dei dati della balla lato PRESSISTA
        case "pressista":
        case "presser": 
            return getSrvUrl() + "/presser/get";
        case "aggiungi-balla-pressista": 
        case "add-presser-bale": 
            return getSrvUrl() + "/presser/set"; // non ancora sviluppata
        // case "rimuovi-balla-pressista": case "delete-presser-bale": return getSrvUrl() + "/presser/delete"; // non ancora sviluppata
        // case "aggiorna-balla-pressista": 
        // case "update-presser-bale": 
        //     return getSrvUrl() + "/presser/update";
        
        //////////////////////////////////////////////////////
        // Rotte per la gestione dei dati della balla lato CARRELLISTA
        case "carrellista": 
        case "wheelman": 
            return getSrvUrl() + "/wheelman/get";
        case "aggiungi-balla-carrellista": 
        case "add-wheelman-bale": 
            return getSrvUrl() + "/wheelman/set"; // non ancora sviluppata
        // case "rimuovi-balla-carrellista" || "delete-wheelman-bale": return getSrvUrl() + "/wheelman/delete"; // non ancora sviluppata
        // case "aggiorna-balla-carrellista": 
        // case "update-wheelman-bale": 
        //     return getSrvUrl() + "/wheelman/update";

        // //////////////////////////////////////////////////////
        // // Rotte per la gestione dei dati di ogni inserimento, eliomina, modifica di qualsiasi balla
        // // si potranno ottenere tutti i vari contatori delle balle inserite per tipo di plastica,
        // // tipo reimballaggio, ecc...
        case "report-giornaliero": 
        case "report-daily": 
            return getSrvUrl() + "/report/daily";

        case "report-live": 
            return getSrvUrl() + "/report/contatori";

        case "report-balletotali": 
            return getSrvUrl() + "/report/total-bale";
        
        case "report-contatori": 
        // case "report-daily": 
            return getSrvUrl() + "/report/contatori";
        case "report-total-bale": 
        // case "report-daily": 
            return getSrvUrl() + "/report/total-bale";
        // case "aggiungi-balla": case "add-bale": return getSrvUrl() + "/bale/add";
        // case "rimuovi-balla": case "delete-bale": return getSrvUrl() + "/bale/delete";
        // case "aggiorna-stato-balla": case "update-status-bale": return getSrvUrl() + "/bale/status/update";
        // case "totale-balle": case "total-bale-count": return getSrvUrl() + "/bale/total-count";
        // case "id-balla": case "id-bale": return getSrvUrl() + "/bale/id";

        case 'health-check':
            return getSrvUrl() + "/health";
    }
}

/**
 * Update the status of total bale
 * @param {string} url 
 * @param {object} body 
 */
const updateStatusTotalbale = async (body, method = 'POST', url = getServerRoute("update-status-bale")) => {
    try {
        if (body === undefined || body === null)
            throw new Error("Empty body passed");

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ body })
        });
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Fetch Data for report
 * @param {string} reportFor 
 * @param {Date} dateForReport
 * @returns 
 */
const fetchReportData = async (reportFor, dateForReport) => {
    try {
        console.log(reportFor, dateForReport);

        // Definisci gli impianti da considerare in base al pulsante premuto
        const implant = (reportFor === 'impianto-a') ? [1] : 
                        (reportFor === 'impianto-b') ? [2] : 
                        (reportFor === 'impianto-ab') ? [1, 2] : 0;
        
        const url = getServerRoute("report-daily");
        
        if (implant === 0) {
            console.log("Impianto type is invalid.");
            return;
        }
        
        let allData = [];

        for (const i in implant) {
            console.log("Fetching data for Impianto:", implant[i]);
            const resp = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ implant: implant[i], date: dateForReport })
            });

            const data = await resp.json();
            console.log("Server Response:", data);

            if (data.code === 0) {
                allData.push(data.data);
            } else {
                // setEmpty(true);
            }
        }

        if (allData.length > 0) {
            // Combina i dati degli impianti A e B se reportFor è 'impianto-ab'
            if (reportFor === 'impianto-ab') {
                const mergedData = [...allData[0], ...allData[1]];  // Unisce i dati dei due impianti
                // setReportData(mergedData);
                return mergedData;
            } else {
                // setReportData(allData[0]);  // Impianto singolo
                return allData[0];
            }
        }

        return allData;

    } catch (error) {
        console.error("Error Fetching Data:", error);
        return null;
    }
};

export { 
    getEnv, 
    getSrvUrl, 
    getWsUrl, 
    getBgColor,
    refreshPage,
    isWebSocketConnected,
    getServerRoute,
    updateStatusTotalbale,
    fetchReportData
};