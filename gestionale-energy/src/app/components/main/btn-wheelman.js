'use client'
import Alert from '@@/components/main/alert';
import { getServerRoute } from '@@/config';
import React, { useState } from "react";
import Image from 'next/image';

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
    ...props
}) {

    console.log(baleObj);

    const confirm_message = `Sei sicuro di voler stampare la balla ${baleObj.idUnique} ?`;
    
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
        baleObj.setIdBale(null);
    }

    const handleUpdate = async (id) => handleAlert("", 'update-w');

    const handleClick = (f) => {
        // Check if idSelect is not null and has a length property
        if (baleObj && baleObj.idBale !== null) {
            handleUpdate(baleObj.idBale);
        } else {
            handleAlert("Nessuna balla selezionata!");
        }
    }

    const handleStampa = async (execute = false) => {
        
        if (baleObj.idBale) {
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
    };
    
    return(
        <>
            <div className="w-1/2 font-bold on-fix-index">
                <div className="flex flex-row-reverse px-11">
                    <button className="on-btn-wheelman" onClick={() => handleClick()}>
                        <div className="flex items-center p-1">
                            <Image 
                                src={"/filled/modifica-bianco-filled.png"}
                                width={25}
                                height={25}
                                alt="Aggiungi icona"
                                className={"mr-2"}
                            />
                            Modifica
                        </div>
                    </button>
                    <button className="on-btn-wheelman" onClick={() => handleStampa()}>
                        <div className="flex items-center p-1">
                            <Image 
                                src={"/filled/stampa-bianco-filled.png"}
                                width={25}
                                height={25}
                                alt="Aggiungi icona"
                                className="mr-2"
                            />
                            Stampa etich.
                        </div>
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

