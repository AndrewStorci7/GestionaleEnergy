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
export default function AddBale({ bale }) {
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const addNewBale = () =>  {
        /* const test = {
            id_presser: 1,
            id_plastic: '\'IPS/C\'',
            id_rei: null,
            id_cpb: null,
            id_sb: null,
            note: 'Prova inserimento da AddBale',
        }

        console.log(JSON.stringify(test))

        const check = await fetch(srvurl + '/add-bale', {
            method: 'POST',
            body: JSON.stringify({ data: test}),
            headers: {'Content-Type': 'application/json' }
        })

        console.log(check) */
    }

    const gestioneErrori = () => {
        setShowErrorAlert(true);
    };

    const closeAlert = () => {
        setShowErrorAlert(false);
    };

    return (
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