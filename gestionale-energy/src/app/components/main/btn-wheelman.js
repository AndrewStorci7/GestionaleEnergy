'use client'
import React from "react";
import Image from 'next/image';
import { useAlert } from '@main/alert/alertProvider';

/**
 * Button for wheelman
 * @author Daniele Zeraschi from Oppimittinetworking
 * 
 * @param {object}   baleObj         Oggetto composto dai seguenti attributi: { `idBale`(number): id della balla, `setIdBale`(function): gancio per aggiornare l'id in caso di elimina }
 * @param {number}   idUnique        Id univoco della balla intera
 * @param {number}   implant         Id dell'impianto che serve per aggiungere una nuova balla
 * @param {number}   idUser          Id dell'utente che serve per aggiungere una nuova balla
 * @param {function} clickAddHandle  Funzione che gestisce il funzionamento del click del bottone, passa i dati ricevuti
 * @param {function} handleSelect
 */

export default function BtnWheelman({ 
    baleObj,
    ...props
}) {

    const { showAlert, hideAlert } = useAlert();

    const handleClick = (type) => {
        if (baleObj && baleObj.idBale !== null) {
            showAlert({ 
                title: type === "update" ? null : "Attenzione", 
                message: type === "update" ? null : `Sei sicuro di voler stampare la balla ${baleObj.idUnique} ?`, 
                type: type === "update" ? "update-w" : "confirm", 
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
    
    return(
        <div className="w-1/2 font-bold on-fix-index">
            <div className="flex flex-row-reverse px-11">
                <button className="on-btn-wheelman" onClick={() => handleClick("update")}>
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
                <button className="on-btn-wheelman" onClick={() => handleClick("print")}>
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
    )
}

