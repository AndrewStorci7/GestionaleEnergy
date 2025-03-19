'use client'
import Alert from '@@/components/main/alert';
import { getServerRoute } from '@@/config';
import React, { useEffect, useState } from "react";

/**
 * Button for wheelman
 * @author Daniele Zeraschi from Oppimittinetworking
 * 
 * @param {object}   idSelect        {
 *  `status`<boolean>     Indica se una qualsiasi riga della tabella è stata selezioanta;
 *  `id`<number>          Indica l'id dela balla da modificare/eliminare (null di default)
 * }
 *
 * @param {string}   alertFor     Il tipo di alert: [ 'error' | 'note' | 'confirmed' | 'update-p' | 'update-w' ]
 *                                 error: Errore
 *                               confirmed: Conferma operazione generica
 *                               note: Visuaizzazione note
 *                               update-p: Alert per modifica dati balla pressista
 *                               update-w: Alert per modificare dati balla carrellista
 * 
 * @param {number}   idUnique        Id univoco della balla intera
 * 
 * @param {number}   implant         Id dell'impianto che serve per aggiungere una nuova balla
 * 
 * @param {number}   idUser          Id dell'utente che serve per aggiungere una nuova balla
 *  
 * @param {function} clickAddHandle  Funzione che gestisce il funzionamento del click del bottone, 
 *                                   passa i dati ricevuti
 * 
 * @param {function} handleSelect
 */

export default function BtnWheelman({ 
    idSelect,
    idUnique,
    implant, 
    idUser, 
    clickAddHandle
}) {

    const confirm_message = `Sei sicuro di voler stampare la balla ${idUnique} ?`;
    const [idBale, setIdBale] = useState(0)

    useEffect(() => {
        setIdBale(idSelect)
    }, [idSelect]);

    const handleUpdate = async (id) => {
        const f_id = (typeof id === 'object') ? id[0] : id;
        setIdBale(f_id);
        handleAlert("", 'update-w');
    }

    const handleClick = (f) => {
        // Check if idSelect is not null and has a length property
        if (idSelect !== null && idSelect) {
            handleUpdate(idSelect);
        } else {
            handleAlert("Nessuna balla selezionata!");
        }
        idSelect = null;
    }

    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [scope, setScope] = useState("");

    /**
     * Handle the error when no bale is selected
     * 
     * @param {string} msg Message to display
     */
    const handleAlert = (msg, scope = "error") => {
        setScope(scope);
        setErrorMessage(msg);
        setShowAlert(prev => !prev);
    };

    /**
     * Funzione per chiudere l'alert
     * @param {boolean} isConfirmed 
     */
    const closeAlert = (isConfirmed = false) => {
        if (isConfirmed)
            handleStampa(true);
        setShowAlert(prev => !prev);
    }

    const handleStampa = async (execute = false) => {
        
        if (idSelect !== null && idSelect) {
            if (execute) {
                try {
    
                    const body = { printed: true, where: idSelect }; // Body per l'update della balla del carrellista
                    const body2 = { status: 1, where: idSelect }; // Body per l'update dello stato della balla totale
                    const url_update_wheelman = await getServerRoute("update-wheelman-bale");
                    const url_update_status = await getServerRoute("update-status-bale");
    
                    // Invia la richiesta per aggiornare lo stato della balla
                    const response = await fetch(url_update_wheelman, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ body }),
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
                        handleAlert('Balla stampata correttamente', 'confirmed-successfull');
                    } else {
                        // Se c'è un errore, mostra un messaggio di errore
                        handleAlert(result.message);
                    }
                } catch (error) {
                    handleAlert(error);
                }
                // setShowAlert(prev => !prev);
            } else {
                handleAlert(confirm_message, 'confirmed-print');
            }
        } else {
            // If no bale is selected, show an error alert
            handleAlert('Nessuna Balla selezionata');
        }
        idSelect = null;
    };
    
    return(
        <>
            <div className="w-1/2 font-bold">
                <div className="flex flex-row-reverse px-11">
                    <button className="m-[10px] rounded-md bg-gray-300 p-[5px]" onClick={() => handleClick()}>
                        Modifica
                    </button>
                    <button className="m-[10px] rounded-md bg-gray-300 p-[5px] mr-[30px]" onClick = {() => handleStampa()}>
                        Stampa Etich.
                    </button>
                </div>
            </div>

            {showAlert && 
                <Alert 
                    handleClose={closeAlert} 
                    alertFor={scope} 
                    msg={errorMessage}
                    idBale={idBale}
                />
            }
        </>
        
    )
       
}

