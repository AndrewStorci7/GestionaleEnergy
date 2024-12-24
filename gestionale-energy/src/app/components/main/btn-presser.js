import ErrorAlert from './error-alert';
import { getSrvUrl } from '@@/config';
import React, { useState } from "react";

const srvurl = getSrvUrl()

/**
 * Custom component for adding, updating or erase a bale 
 * 
 * @author Andrea Storci from Oppimittinetworking
 * 
 * @prop {int}      implant         Id dell'impianto che serve per aggiungere una nuova balla
 * 
 * @prop {int}      idUser          Id dell'utente che serve per aggiungere una nuova balla
 *  
 * @prop {function} clickAddHandle  Funzione che gestisce il funzionamento del click del bottone, 
 *                                  passa i dati ricevuti
 */
export default function AddBale({ 
    select,
    implant, 
    idUser, 
    clickAddHandle 
}) {

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
                // TODO insierire componente ErrorAlert
                // console.log("Errore")
                <ErrorAlert alertFor="error" />
            } else {
                clickAddHandle(resp.data)
            }
        } catch (error) {
            <ErrorAlert alertFor="error" />
        }
    }

    const gestioneErrori = () => {
        setShowErrorAlert(true);
    };

    const closeAlert = () => {
        setShowErrorAlert(!showErrorAlert);
    };

    const handleDelete = () => {
        console.log("Elimina")
    }

    const handleUpdate = () => {
        console.log("Modifica")
    }

    const handleClick = (f) => {
        if (select.status) {
            if (f)
                handleUpdate(select.id)
            else handleDelete(select.id)
        } else {
            setShowErrorAlert(!showErrorAlert)
        }
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
            {showErrorAlert ? 
                <ErrorAlert handleClose={closeAlert} alertFor="error" msg="Per modificare o eliminare bisogna prima selezionare una balla!" />
                : null
            }
        </>
    );
}