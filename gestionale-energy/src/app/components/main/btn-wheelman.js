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
        // console.log(idSelect)
        if (idSelect !== null) {
            handleUpdate(idSelect)
        } else {
            handleAlert("Nessuna balla selezionata!")
        }
    }

    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [scope, setScope] = useState('')

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
    return(
        <>
        <div className="w-1/2 font-bold">
            <div className="flex flex-row-reverse px-11">
                <button className="m-[10px] rounded-md bg-gray-300 p-[5px]" onClick={() => handleClick()}>
                    Modifica
                </button>
                <button className="m-[10px] rounded-md bg-gray-300 p-[5px] mr-[30px]">
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

