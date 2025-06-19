import { getServerRoute } from "@/app/config";

//#region Fetch Data
/**
 * #### Restiuisce i dati della balla inseriti dal pressista o dal carrellista
 * Restiuisce i dati della balla inseriti dal pressista o dal carrellista
 * 
 * @param {*} type 
 */
const fetchDataBale = async (type = null, obj = null, hook = null) => {
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

//#region Gestione Stampa 
/**
 * #### Gestisce la stampa lato server
 * Invia una richiesta al server, modificando lo stato della "balla totale" a `1` (che equivale a "**stampato**")
 * @param {object}  obj     Oggetto contente l'id della balla da stampare (_l'id unico della balla totale_). L'oggetto deve avere questi attributi:
 * * `idBale`[`number|string`]: id della balla del carrellista
 * * `idUnique`[`number|string`]: id unico della balla totale
 * @param {function} hookCancel Funzione che gestisce un qualsiasi errore durante il fetch e mostra l'alert
 * @param {function} hookConfirm Funzione che gestisce la conferma dell'operazione   
 * ~~@param {boolean} execute Se settato su `true` aggiorna lo stato ad `1` ("**stampato**"), altrimenti stampa l'alert di "**conferma stampa**"~~
 */
const handleStampa = async (obj, hookCancel, hookConfirm, execute = true) => {

    if (obj.idBale) {
        if (execute) {
            try {
                const body = { printed: true, where: obj.idBale }; // Body per l'update della balla del carrellista
                const body2 = { status: 1, where: obj.idUnique }; // Body per l'update dello stato della balla totale
                const url_update_wheelman = getServerRoute("update-wheelman-bale");
                const url_update_status = getServerRoute("update-status-bale");

                // Invia la richiesta per aggiornare lo stato della balla
                const response = await fetch(url_update_wheelman, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ body: body }),
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
                type: "confirm"
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
 * Elimina una balla 
 * @param {number}      id 
 * @param {function}    handleAlertChange
 */
const handleDelete = async (id, handleAlertChange, msg) => {

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

export {
    fetchDataBale,
    handleStampa,
    handleDelete
}