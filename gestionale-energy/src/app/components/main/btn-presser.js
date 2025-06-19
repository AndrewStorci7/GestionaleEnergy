'use client'
import React, { useEffect, useState } from "react";
import { useAlert } from "@main/alert/alertProvider";
import Image from "next/image";

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

    const { showAlert, hideAlert } = useAlert();
    const [addWasClicked, setAddWasClicked] = useState(false);

    useEffect(() => {
        if(handleConfirmAdd) {
            setAddWasClicked(false)
        } else {
            setAddWasClicked(true)
        }
    }, [handleConfirmAdd]);

    const addNewBale = () => {
        try {
            setAddWasClicked(prev => !prev);
            clickAddHandle(prev => !prev);
        } catch (error) {
            handleAlert(error);
        }
    }

    const handleClick = (type) => {
        if (baleObj && baleObj.idBale !== null) {
            showAlert({ 
                title: null, 
                message: type === "update" ? null : `Sei sicuro di voler eliminiare la balla ${baleObj.idUnique} ?`, 
                type: type === "update" ? "update-p" : "delete", 
                // onConfirm: () => type === "update" ? null : handleStampa(baleObj, showAlert, hideAlert, false),
                data: baleObj
            });
        } else {
            showAlert({
                title: null,
                message: "Nessuna balla selezionata!",
                type: "error",
            });
        }
    }

    return (
        <>
            <div className="w-1/2 font-bold on-fix-index">
                <div className="flex flex-row-reverse">
                    <button 
                    className="on-btn-presser" 
                    onClick={() => handleClick("delete")}>
                        <div className="flex items-center p-1">
                            <Image 
                                src={"/filled/elimina-bianco-filled.png"}
                                width={25}
                                height={25}
                                alt="Aggiungi icona"
                                className={"mr-2"}
                            />
                            Elimina
                        </div>
                    </button>
                    <button 
                    className="on-btn-presser mr-[50px]" 
                    onClick={() => handleClick("update")}>
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
                    <button 
                    className={`on-btn-presser ${(addWasClicked && !handleConfirmAdd) && "bg-red-400 text-neutral-50"}`} 
                    onClick={addNewBale}>
                        {(addWasClicked && !handleConfirmAdd) ? 
                            "Annulla" 
                        : (
                            <div className="flex items-center p-1">
                                <Image 
                                    src={"/filled/aggiungi-bianco-filled.png"}
                                    width={25}
                                    height={25}
                                    alt="Aggiungi icona"
                                    className={"mr-2"}
                                />
                                Aggiungi
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}
