import { getServerRoute } from "@/app/config";

//#region Fetch Single Bale
/**
 * Restituisce i dati della balla inseriti dal pressista o dal carrellista.
 *
 * @async
 * @function fetchDataBale
 * @param {*} [type=null] - Tipo di utente ('presser' o 'wheelman').
 * @param {*} [obj=null] - Oggetto contenente i dati della balla, deve avere almeno la proprietà `idBale`.
 * @param {function} [hook=null] - Funzione hook da chiamare con i dati ottenuti.
 * @throws {Error} Se i parametri non sono settati correttamente o in caso di errore nella richiesta.
 */
async function fetchDataBale(type = null, obj = null, hook = null) {
    try {
        
        if ( !(type || obj || hook) ) {
            throw new Error("Le prop `type`, `obj`, `hooks` non sono settate correttamente (non possono essere `null`)");
        }

        console.log(obj);

        const url = getServerRoute(type === 'presser' ? 'presser' : 'wheelman');
        const resp = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id: obj.idBale })
        });

        const data = await resp.json();

        console.log(data);
        if (data) {
            hook(data);
        } 
        // else {
        //     throw new Error("SALAMALEKU")
        // }
    } catch (error) {
        throw new Error(error.message);
    }
}

//#region Fetch Total Bale
/**
 * Recupera i dati totali delle balle e aggiorna lo stato dell'applicazione.
 *
 * @async
 * @function fetchDataTotalBale
 * @param {*} [data=null] - Dati da inviare al server per la richiesta.
 * @param {string} type - Tipo di dati da recuperare ('presser' o 'wheelman').
 * @param {function} setContent - Funzione per aggiornare il contenuto con i dati ricevuti.
 * @param {function} setEmpty - Funzione per impostare lo stato di "vuoto" in caso di errore o dati mancanti.
 * @param {function} hook - Funzione hook opzionale da chiamare in caso di errore.
 * @param {function} showAlert - Funzione per mostrare un alert in caso di errore.
 * @throws {Error} Se il parametro `data` è nullo o in caso di errore nella richiesta.
 */
async function fetchDataTotalBale(data = null, type = 'presser', setContent, setEmpty, hook, showAlert) {
    try {
        if (data === null || data === undefined) throw new Error("errore nella chiamata della funzione `fetchDataTotalBale`: parametro `data` risulta `null` o `undefined`");
        if (type === null || type === undefined || type === "") throw new Error("errore nella chiamata della funzione `fetchDataTotalBale`: parametro `type` risulta `null`, `undefined` o una stringa vuota");

        const url = getServerRoute("bale");
        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ body: data }),
        });

        const dataJson = await resp.json();

        console.log(dataJson);

        if (dataJson.code === 0) {
            setEmpty(false);

            if (dataJson.presser && Array.isArray(dataJson.presser) && dataJson.presser.length > 0) {
                dataJson.presser.map((bale, index) => {
                    if (dataJson.wheelman[index]) {
                        dataJson.wheelman[index].plasticPresser = bale.plastic;
                    }
                });
            }

            if (dataJson.wheelman && Array.isArray(dataJson.wheelman) && dataJson.wheelman.length > 0) {
                dataJson.wheelman.map((bale, index) => {
                    if (dataJson.presser[index]) {
                        dataJson.presser[index]._idCwb = bale._idCwb;
                    }
                });
            }

            let contentData = type === "presser" ? dataJson.presser : type === "wheelman" ? dataJson.wheelman : [];

            console.log("Dati ricevuti all'interno di fetchDataTotalBale: " + data.useFor + " " + type);

            if (data.useFor === 'regular' || data.useFor === 'specific') {
                if (type === 'wheelman') {
                    contentData.sort((a, b) => new Date(b.data_ins) - new Date(a.data_ins));
                } else if (type === 'presser') {
                    contentData.sort((a, b) => new Date(b.data_ins) - new Date(a.data_ins));
                }
            } else if (data.useFor === 'reverse') {
                if (type === 'wheelman') {
                    contentData.sort((a, b) => new Date(a.data_ins) - new Date(b.data_ins));
                } else if (type === 'presser') {
                    contentData.sort((a, b) => new Date(a.data_ins) - new Date(b.data_ins));
                }
            } 
            // else if (data.useFor === 'specific') {
            //     // Per le balle completate, mantieni l'ordinamento del database
            //     // o applica una logica specifica se necessario
            // }

            setContent(contentData);
        } else {
            setEmpty(true);
            hook && hook(dataJson.message);
        }
    } catch (error) {
        console.error("Errore in fetchDataTotalBale:", error);
        showAlert({
            title: null,
            message: error.message,
            type: 'error'
        });
    }
}

//#region Gestione Stampa 
/**
 * Gestisce la stampa lato server, aggiornando lo stato della balla totale a "stampato".
 *
 * @async
 * @function handleStampa
 * @param {object} obj - Oggetto contenente l'id della balla da stampare.
 * @param {number|string} obj.idBale - ID della balla del carrellista.
 * @param {number|string} obj.idUnique - ID unico della balla totale.
 * @param {function} hookCancel - Funzione chiamata in caso di errore o per mostrare alert di conferma.
 * @param {function} hookConfirm - Funzione chiamata in caso di conferma dell'operazione.
 * @param {boolean} [execute=true] - Se true aggiorna lo stato a "stampato", altrimenti mostra alert di conferma.
 */
const handleStampa = async (obj, hookCancel, hookConfirm, execute = true) => {

    if (obj.idBale) {
        if (execute) {
            try {
                const body = { printed: true, where: obj.idBale }; // Body per l'update della balla del carrellista
                const body2 = { status: 1, where: obj.idUnique }; // Body per l'update dello stato della balla totale
                const url_update_wheelman = getServerRoute("update-bale");
                const url_update_status = getServerRoute("update-status-bale");

                // Invia la richiesta per aggiornare lo stato della balla
                const response = await fetch(url_update_wheelman, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ body: body, type: "wheelman" }),
                });

                // Aggiorno lo stato della balla totale così da informare anche l'altro utente che c'è stata una modifica
                const response2 = await fetch(url_update_status, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ body: body2 }),
                });
    
                const result = await response.json();
                const result2 = await response2.json();

                if (result.code === 0 && result2.code === 0) {
                    // Se la risposta è positiva, mostra un messaggio di conferma
                    hookConfirm();
                } else {
                    // Se c'è un errore, mostra un messaggio di errore
                    // hookCancel(result.message);
                    hookCancel({
                        title: null,
                        message: result.code !== 0 ? result.message : result2.code !== 0 ? result2.message : "Problema generico dovuto dalla stampa di una balla, contattare gli amministratori del sistema e/o i capi turno",
                        type: "error"
                    });
                }
            } catch (error) {
                hookCancel({
                    title: null,
                    message: error,
                    type: "error"
                });
            }
        } else {
            hookCancel({
                title: "Attenzione",
                message: "Stai per stampare una balla con peso pari a zero, vuoi procedere ugualmente ?", 
                type: "confirm",
                data: obj
            });
        }
    } else {
        // If no bale is selected, show an error alert
        hookCancel({
            title: null,
            message: "Nessuna Balla selezionata",
            type: "error"
        });
    }
};

//#region Gestione Elimina
/**
 * Elimina una balla.
 *
 * @async
 * @function handleDelete
 * @param {number} id - ID della balla da eliminare.
 * @param {function} handleAlertChange - Funzione hook per gestire gli alert.
 * @throws {Error} Se `handleAlertChange` non è una funzione o in caso di errore nella richiesta.
 */
const handleDelete = async (id, handleAlertChange) => {

    if (typeof handleAlertChange !== "function") {
        throw new Error("Errore: `handleAlert` must be a function hook");
    }

    try {
        console.log("entrato nel try/catch di `handleDelete`: id balla => " + id);
        const url = getServerRoute('delete-bale');
        const check = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_bale: id }),
        });

        const resp = await check.json();

        if (resp.code < 0) {
            console.log("risposta ottenuta da `handleDelete`: " + resp.message);
            throw new Error(resp.message);
        } 
    } catch (error) {
        throw new Error(error);
    }
}

//#region Totale Chili
/**
 * 
 * @param {*} implant 
 * @returns 
 */
const fetchTotaleChili = async (implant) => {
    try {
        const response = await fetch(getServerRoute("totale-chili"), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ implant })
        });
        const data = await response.json();
        if (data.code === 0) {
            return data.message;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error("Errore nel recupero del totale chili:", error);
        throw error;
    }
}

export {
    fetchDataBale,
    fetchDataTotalBale,
    handleStampa,
    handleDelete,
    fetchTotaleChili
}