'use client'
import Alert from '@@/components/main/alert';
import { getServerRoute } from '@@/config';
import React, { useEffect, useState } from "react";

/**
 * Custom component for adding, updating or erase a bale 
 * 
 * @author Andrea Storci from Oppimittinetworking
 * 
 * @param {object}   idSelect         Oggetto composto dai seguenti attributi: { `idBale`(number): id della balla, `setIdBale`(function): gancio per aggiornare l'id in caso di elimina }
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
    idSelect,
    handleConfirmAdd = false, 
    clickAddHandle
}) {

    const default_message = `Balla numero ${idSelect.idUnique} eliminata correttamente!`;

    const [idBale, setIdBale] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [addWasClicked, setAddWasClicked] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [scope, setScope] = useState('');

    useEffect(() => {
        setIdBale(idSelect.idBale);
    }, [idSelect]);

    const addNewBale = () => {
        try {
            // console.log("First step ADD, calling 'clickAddHandle()'");
            setAddWasClicked(prev => !prev);
            clickAddHandle();
        } catch (error) {
            handleAlert(error);
        }
    }

    const handleDelete = async (id) => {
        try {
            // const f_id = (typeof id === 'object') ? id[0] : id;
            const url = getServerRoute('delete-bale');
            const check = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify({ id_bale: id }),
            });
    
            const resp = await check.json();
    
            if (resp.code < 0) {
                handleAlert(resp.message);
            } else {
                handleAlert(default_message, 'confirmed');
            } 
        } catch (error) {
            handleAlert(error);
        }
        idSelect.setIdBale(null);
    }

    const handleUpdate = async (id) => {
        // const f_id = (typeof id === 'object') ? id[0] : id;
        setIdBale(id);
        handleAlert("", 'update-p');
    }

    const handleClick = (f) => {
        if (idSelect && idSelect.idBale !== null) {
            if (f) handleUpdate(idSelect.idBale);
            else handleDelete(idSelect.idBale);
        } else {
            handleAlert("Nessuna balla selezionata!");
        }
    }

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

    // Funzione per chiudere l'alert
    const closeAlert = () => {
        setShowAlert(prev => !prev);
    };

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
                    idBale={idBale}
                />
            }
        </>
    );
}