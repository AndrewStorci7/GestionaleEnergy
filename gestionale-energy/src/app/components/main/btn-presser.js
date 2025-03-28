'use client'
import Alert from '@@/components/main/alert';
import { getServerRoute } from '@@/config';
import React, { useEffect, useState } from "react";

/**
 * Custom component for adding, updating or erase a bale 
 * 
 * @author Andrea Storci from Oppimittinetworking
 * 
 * @param {object}   baleObj          Oggetto composto dai seguenti attributi: { `idBale`(number): id della balla, `setIdBale`(function): gancio per aggiornare l'id in caso di elimina }
 * 
 * @param {boolean}  handleConfirmAdd Tiene traccia del fatto che il bottone di conferma inserimento sia stato cliccato
 * 
 * @param {int}      idUnique         Id contatore della balla totale
 * 
 * @param {int}      implant          Id dell'impianto che serve per aggiungere una nuova balla
 * 
 * @param {int}      idUser           Id dell'utente che serve per aggiungere una nuova balla
 *  
 * @param {function} clickAddHandle   Funzione che gestisce il funzionamento del click del bottone, 
 *                                    passa i dati ricevuti
 * @param {function} handleSelect
 */
export default function BtnPresser({ 
    baleObj,
    handleConfirmAdd = false, 
    clickAddHandle
}) {

    const default_message = `Balla numero ${baleObj.idUnique} eliminata correttamente!`;
    const confirm_message = `Sei sicuro di voler eliminare la balla ${baleObj.idUnique} ?`;

    const [idBale, setIdBale] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [addWasClicked, setAddWasClicked] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [scope, setScope] = useState('');

    useEffect(() => {
        setIdBale(baleObj.idBale);
    }, [baleObj]);
    
    const handleAlert = async (msg, scope = "error") => {
        setScope(scope);
        setErrorMessage(msg);
        setShowAlert(prev => !prev);
    };

    const closeAlert = () => {
        setShowAlert(prev => !prev);
        baleObj.setIdBale(null);
    };

    const addNewBale = () => {
        try {
            setAddWasClicked(prev => !prev);
            clickAddHandle();
        } catch (error) {
            handleAlert(error);
        }
    }

    const handleClick = (f) => {
        if (baleObj && baleObj.idBale !== null) {
            if (f) handleAlert("", 'update-p');
            else handleAlert(confirm_message, "delete-confirm");
        } else {
            handleAlert("Nessuna balla selezionata!");
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
                    className={`on-btn-presser ${(addWasClicked && !handleConfirmAdd) && "bg-red-400 text-neutral-50"}`} 
                    onClick={addNewBale}>
                        {(addWasClicked && !handleConfirmAdd) ? "Annulla" : "Aggiungi"}
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
    );
}
