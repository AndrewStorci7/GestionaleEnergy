'use client'
import Alert from '@@/components/main/alert';
import { getServerRoute } from '@@/config';
import React, { useEffect, useState } from "react";

/**
 * Button for wheelman
 * @author Daniele Zeraschi from Oppimittinetworking
 * 
 * @param {object}   baleObj         Oggetto composto dai seguenti attributi: { `idBale`(number): id della balla, `setIdBale`(function): gancio per aggiornare l'id in caso di elimina }
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
    baleObj,
    implant, 
    idUser, 
    clickAddHandle
}) {

    console.log(baleObj);

    const confirm_message = `Sei sicuro di voler stampare la balla ${baleObj.idUnique} ?`;
    // const [idBale, setIdBale] = useState(0);
    
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [scope, setScope] = useState("");

    // useEffect(() => {
    //     setIdBale(baleObj);
    // }, [baleObj]);
    
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

    const handleUpdate = async (id) => {
        // setIdBale(id);
        handleAlert("", 'update-w');
    }

    const handleClick = (f) => {
        // Check if idSelect is not null and has a length property
        if (baleObj && baleObj.idBale !== null) {
            handleUpdate(baleObj.idBale);
        } else {
            handleAlert("Nessuna balla selezionata!");
        }
        // baleObj.setIdBale(null);
    }

    const handleStampa = async (execute = false) => {
        
        if (baleObj) {
            if (execute) {
                try {
                    const body = { printed: true, where: baleObj.idBale }; // Body per l'update della balla del carrellista
                    const body2 = { status: 1, where: baleObj.idBale }; // Body per l'update dello stato della balla totale
                    const url_update_wheelman = getServerRoute("update-wheelman-bale");
                    const url_update_status = getServerRoute("update-status-bale");
    
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
        // baleObj.setIdBale(null);
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
                    baleObj={baleObj}
                />
            }
        </>
    )
}

