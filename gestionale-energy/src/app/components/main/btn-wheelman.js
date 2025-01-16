'use client'

import Alert from '@@/components/main/alert';
import { getSrvUrl } from '@@/config';
import React, { useEffect, useState } from "react";

const srvurl = getSrvUrl()

/**
 * Button for wheelman
 * @author Daniele Zeraschi from Oppimittinetworking
 * 
 * @param {object}   idSelect        {
 *  `status`<boolean>     Indica se una qualsiasi riga della tabella è stata selezioanta;
 *  `id`<number>          Indica l'id dela balla da modificare/eliminare (null di default)
 * }
 * 
 * @param {int}      implant         Id dell'impianto che serve per aggiungere una nuova balla
 * 
 * @param {int}      idUser          Id dell'utente che serve per aggiungere una nuova balla
 *  
 * @param {function} clickAddHandle  Funzione che gestisce il funzionamento del click del bottone, 
 *                                   passa i dati ricevuti
 * 
 * @param {function} handleSelect
 */

export default function BtnWheelman({ 
    idSelect,
    implant, 
    idUser, 
    clickAddHandle
}) {

    const [idBale, setIdBale] = useState(0)

    useEffect(() => {
        setIdBale(idSelect)
    }, [idSelect])

    const handleUpdate = async (id) => {
        const f_id = (typeof id === 'object') ? id[0] : id;
        setIdBale(f_id)
        handleAlert("", 'update-w')
        // try {
    
        //     const f_id = (typeof id === 'object') ? id[0] : id;

        //     const check = await fetch(srvurl + '/delete-bale', {
        //         method: 'POST',
        //         headers: {'Content-Type': 'application/json' },
        //         body: JSON.stringify({ id_bale: f_id }),
        //     })
    
        //     const resp = await check.json()
    
        //     if (resp.code < 0) {
        //         handleAlert(resp.message)
        //     }
        // } catch (error) {
        //     handleAlert(error)
        // }
    }

    const handleClick = (f) => {
        // Check if idSelect is not null and has a length property
        if (idSelect !== null && idSelect.length > 0) {
            handleUpdate(idSelect)
        } else {
            handleAlert("Nessuna balla selezionata!")
        }
    }
    

    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [scope, setScope] = useState("")

    /**
     * Handle the error when no bale is selected
     * 
     * @param {string} msg Message to display
     */
    const handleAlert = (msg, scope = "error") => {
        setScope(scope)
        setErrorMessage(msg);
        setShowAlert(prev => !prev);
    };

    // Funzione per chiudere l'alert
    const closeAlert = () => {
        setShowAlert(prev => !prev);
    };

    const handleStampa = async (msg="I dati sono stati stampati correttamente", scope = "confirmed") => {
        if (idSelect !== null && idSelect.length > 0) {
            try {

                const body = {printed: true, where: idSelect};
                // Invia la richiesta per aggiornare lo stato della balla
                const response = await fetch(srvurl + '/uwheelmanbale', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({body}),
                });
    
                const result = await response.json();
    
                if (result.code === 0) {
                    // Se la risposta è positiva, mostra un messaggio di conferma
                    setScope(scope);
                    setErrorMessage(msg);
                } else {
                    // Se c'è un errore, mostra un messaggio di errore
                    setScope("error");
                    setErrorMessage(result.message);
                }
            } catch (error) {
                setScope("error");
                setErrorMessage("Si è verificato un errore durante l'aggiornamento.");
            }
            setShowAlert(prev => !prev);
        } else {
            handleAlert("Nessuna balla selezionata!");
        }
    }
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

