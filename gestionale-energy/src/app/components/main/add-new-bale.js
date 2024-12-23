import ErrorAlert from './error-alert';
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
export default function AddBale({ 
    select, 
    implant, 
    idUser, 
    clickAddHandle 
}) {
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const addNewBale = async () => {
        const data = {
            id_presser: idUser,
            id_implant: implant
        };

        const check = await fetch(srvurl + '/add-bale', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ data }),
        });

        const resp = await check.json();

        if (!check.ok) {
            console.log("Errore");
        } else {
            clickAddHandle(resp.data);
        }
    };

    // const gestioneErrori = (action) => {
    //     console.log(selectedBaleIdRef);
    //     if (!selectedBaleIdRef.target) { 
    //         setShowErrorAlert(true);
    //     } else {
            
    //         console.log(`${action} balla con ID: ${selectedBaleIdRef.current}`);
    //     }
    // };

    const closeAlert = () => {
        setShowErrorAlert(false);
    };

    const handleClick = () => {
        console.log("Modifica/Elimina cliccato")
        console.log(select.status)
    }

    console.log(select)

    return (
        <div className="w-1/2 font-bold">
            <div className="flex flex-row-reverse">
                <button
                    className="m-[10px] rounded-md bg-gray-300 p-[5px]"
                    // onClick={() => gestioneErrori("Elimina")}
                >
                    Elimina
                </button>
                <button
                    className="m-[10px] rounded-md bg-gray-300 p-[5px] mr-[50px]"
                    onClick={handleClick}
                >
                    Modifica
                </button>
                <button 
                className="m-[10px] rounded-md bg-gray-300 p-[5px]" 
                onClick={addNewBale}>
                    Aggiungi
                </button>
            </div>
            {showErrorAlert && <ErrorAlert msg="Seleziona una balla prima di procedere!" alertFor="error" onClose={closeAlert} />}
        </div>
    );
}