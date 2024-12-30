import ErrorAlert from './error-alert';
import { getSrvUrl } from '@@/config';
import React, { useState } from "react";

const srvurl = getSrvUrl()

/**
 * Custom component for adding, updating or erase a bale 
 * 
 * @author Andrea Storci from Oppimittinetworking
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
 */
export default function AddBale({ 
    idSelect,
    implant, 
    idUser, 
    clickAddHandle 
}) {
    console.log(idSelect)
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const addNewBale = async () =>  {
        try {
            const data = {
                id_presser: idUser,
                id_implant: implant
            }
    
            const check = await fetch(srvurl + '/add-bale', {
                method: 'POST',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify({ data }),
            })
    
            const resp = await check.json()
    
            if (!check.ok) {
                handleError("Errore nel SERVER durante la modifica!")
            } else {
                clickAddHandle(resp.data)
            }
        } catch (error) {
            handleError(error)
        }
    }

    const gestioneErrori = () => {
        setShowErrorAlert(true);
    };

    const closeAlert = () => {
        setShowErrorAlert(!showErrorAlert);
    };

    const handleDelete = async (id) => {
        try {
            // const data = {
            //     id_presser: idUser,
            //     id_implant: implant
            // }
    
            const check = await fetch(srvurl + '/delete-bale', {
                method: 'POST',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify({ id_bale: id }),
            })
    
            const resp = await check.json()
    
            if (resp.code < 0) {
                handleError(resp.message)
            }
        } catch (error) {
            handleError(error)
        }
    }

    const handleUpdate = (id) => {
        console.log("Modifica" + id)
    }

    const handleClick = (f) => {
        // console.log(idSelect)
        if (idSelect !== null) {
            if (f)
                handleUpdate(idSelect)
            else handleDelete(idSelect)
        } else {
            handleError("Nessuna balla selezionata!")
        }
    }

    /**
     * Handle the error when no bale is selcted
     * 
     * @param {string} msg Message to display
     */
    const handleError = (msg, scope = "error") => {
        return (
            <ErrorAlert 
                handleClose={closeAlert} 
                alertFor={scope} 
                msg={msg}
            />
        )
    }

    return (
        <>
            <div className="w-1/2 font-bold on-fix-index">
                <div className="flex flex-row-reverse">
                    <button 
                    className="on-btn-presser" 
                    onClick={() => handleClick(false)}>
                        Elimina
                    </button>
                    <button 
                    className="on-btn-presser mr-[50px]" 
                    onClick={() => handleClick(true)}>
                        Modifica
                    </button>
                    <button 
                    className="on-btn-presser" 
                    onClick={addNewBale}>
                        Aggiungi
                    </button>
                </div>
            </div>
        </>
    );
}