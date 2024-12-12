import ErrorAlert from '@/app/pages/daniele/error-alert';
import { getSrvUrl } from '@@/config';
import React, { useState } from "react";

const srvurl = getSrvUrl()

/**
 * Custom component for adding, updating or erase a bale 
 * 
 * @author Andrea Storci from Oppimittinetworking
 * 
 * @param {ref} bale
 * 
 * @returns 
 */
export default function AddBale({ implant, idUser, clickAddHandle }) {

    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const addNewBale = async () =>  {

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
            console.log("Errore")
        } else {
            clickAddHandle(resp.data)
        }
    }

    const gestioneErrori = () => {
        setShowErrorAlert(true);
    };

    const closeAlert = () => {
        setShowErrorAlert(false);
    };

    return(
        <div className="w-1/2 font-bold">
            {showErrorAlert && <ErrorAlert error="Questo e' un errore" onClose={closeAlert} />}
            <div className="flex flex-row-reverse">
                <button className="m-[10px] rounded-md bg-gray-300 p-[5px]" onClick={gestioneErrori}>
                    Elimina
                </button>
                <button className="m-[10px] rounded-md bg-gray-300 p-[5px] mr-[50px]" onClick={gestioneErrori}>
                    Modifica
                </button>
                <button 
                    className="m-[10px] rounded-md bg-gray-300 p-[5px]"
                    onClick={addNewBale}
                >
                    Aggiungi
                </button>
            </div>
        </div>
    );
}