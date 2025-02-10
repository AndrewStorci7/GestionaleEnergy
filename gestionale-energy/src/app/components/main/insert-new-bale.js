'use-client';

import { getSrvUrl } from '@/app/config'
import React, { useState } from 'react'
import CheckButton from "./select-button"
import Icon from './get-icon';
import SelectInput from './search/select'
import Cookies from 'js-cookie';
import Alert from './alert';

const srvurl = getSrvUrl();

/**
 * Compoent used only by type 'presser' and 'wheelman'
 * 
 * @author Andrea Storci from Oppimittinetworking
 * 
 * @param {string}  type    [ 'presser' | 'wheelman' ]
 * 
 * @param {boolean} mod     [ true | false]
 *                          True se è possibile modificare i dati, altrimenti false
 * 
 * @param {object}  ids     Oggetto contenente gli ID delle nuove balle create
 *                          L.oggetto sarà diverso da null quando il bottone aggiungi verrà cliccato
 * 
 * @param {boolean} primary [ true | false ]
 *                          True se è primario (mostrerà alcune opzioni aggiuntive) 
 * 
 * @prop {function} confirmHandle Funzione che gestisce la conferma dell'aggiunta
 */
export default function InsertNewBale({ 
    type, 
    mod, 
    ids, 
    primary, 
    confirmHandle,
    visible = false
}) {

    const _CMNSTYLE_TD = "on-table-td";

    // Dati Pressista
    const [plastic, setPlastic] = useState(""); // Id plastica
    const [plastic2, setPlastic2] = useState(""); // Codice plastica   
    const [rei, setRei] = useState(""); // Stato se balla reimballata
    const [cdbp, setCdbp] = useState(""); // Condizione balla pressista
    const [selected_b, setSelectedBale] = useState(""); // Balla selezionata
    
    // Dati carrellista
    const [cdbc, setCdbc] = useState(""); // Condizione balla carrellista
    const [reason, setReason] = useState(""); // Motivazione
    const [weight, setWeight] = useState(0); // Peso
    const [dest_wh, setDestWh] = useState(""); // magazzino destinazione

    const [note, setNote] = useState(""); // Note (sia carrellista che pressista)

    const [status, setStatus] = useState("working"); // Stato lavorazione

    const [showConfirm, setShowConfirm] = useState(false);

    /**
     * Handle Click function
     * Questa funzione gestisce i dati per l'inserimetno di una nuova balla
     * 
     * @param {boolean} f 
     */
    const handleClick = (f) => {
        try {
            const cookie = JSON.parse(Cookies.get('user-info'));
            // const url = srvurl + "/upresserbale";
            if (!plastic || plastic === null || plastic == "undefined" || plastic == "")
                console.log("Plastica non selezionata"); 

            const url = srvurl + "/add-bale";
            const implant = cookie.id_implant;
            const body = {
                id_presser: cookie.id_user,
                id_plastic: plastic,
                id_rei: rei || 1,
                id_cpb: cdbp || 1,
                id_sb: selected_b || 1,
                note: note,
            };

            const resp = fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ data: { implant, body } })
            })

            if (!resp.ok) {
                // console.error(resp.json)
            }

        } catch (error) {
            // TOFIX
            // <Alert msg={error} />
            console.error(error);
        }
    };

    const handleConfirmed = () =>{
        confirmHandle()
        setShowConfirm(prev => !prev);
    };

    /**
     * Handle view Alert
     * 
     * @param {string} msg Message to display
     */
    const handleAlert = (msg, scope = "error") => {
        setScope(scope);
        setErrorMessage(msg);
        setShowAlert(prev => !prev);
    };

    switch (type) {
        case "presser": {
            return (
                // <tr className={`${_CMNSTYLE_TD} ${!visible && "hidden"}`}>
                <tr className={`${_CMNSTYLE_TD}`}>
                    {(primary) ? (
                        <>
                            <td className={`${_CMNSTYLE_TD}`} >
                                <CheckButton />
                            </td>
                            <td></td>
                            <td className={`${_CMNSTYLE_TD}`} >
                                <Icon type={status} />
                            </td>
                        </>
                    ) : null }
                    <td className={`${_CMNSTYLE_TD}`}>
                        {(mod) && 
                        <SelectInput 
                        searchFor={"plastic"}
                        value={plastic}
                        onChange={(e) => { 
                            let code = e.target.selectedOptions[0].getAttribute("data-code");
                            setPlastic(e.target.value); 
                            setPlastic2(code);
                        }} 
                        fixedW />}
                    </td>
                    <td className={`${_CMNSTYLE_TD}`}>
                        {(mod) && plastic2}
                    </td>
                    <td className={`${_CMNSTYLE_TD}`}>
                        {(mod) && 
                        <SelectInput 
                        searchFor={"rei"} 
                        value={rei}
                        onChange={(e) => setRei(e.target.value)} 
                        fixedW />}
                    </td>
                    <td className={`${_CMNSTYLE_TD}`}>
                        {(mod) && 
                        <SelectInput 
                        searchFor={"cdbp"} 
                        value={cdbp}
                        onChange={(e) => setCdbp(e.target.value)}  
                        fixedW />}
                    </td>
                    <td className={`${_CMNSTYLE_TD}`}>
                        {(mod) &&
                        <SelectInput 
                        searchFor={"selected-b"} 
                        value={selected_b}
                        onChange={(e) => setSelectedBale(e.target.value)} 
                        fixedW />}
                    </td>
                    <td className={`${_CMNSTYLE_TD}`}>
                        {(mod) && <input 
                        type="text"
                        id="note-pressista"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Inserisci note"
                        />}
                    </td>
                    {(primary) ? (
                        <td className={`${_CMNSTYLE_TD}`} >
                            <button 
                            className='on-btn-confirm'
                            onClick={() => { 
                                handleClick(true);
                                handleConfirmed();
                            }}
                            >
                                OK
                            </button>
                            {showConfirm && <Alert alertFor="confirmed" handleClose={handleConfirmed} />}
                        </td>
                    ) : null }
                    <td className={`${_CMNSTYLE_TD}`}>
                        {/* DATA */}
                        {/* (mod) && <SelectInput searchFor={"plastic"} fixedW /> */}
                    </td>
                    <td className={`${_CMNSTYLE_TD}`}>
                        {/* ORA */}
                        {/* (mod) && <SelectInput searchFor={"plastic"} fixedW /> */}
                    </td>
                </tr>
            )
        }
        case "wheelman": {
            return (
                // <tr className={`${_CMNSTYLE_TD} ${!visible && "hidden"}`} >
                <tr className={`${_CMNSTYLE_TD}`} >
                    {(primary) ? (
                        <>
                            <td className={`${_CMNSTYLE_TD}`} >
                                <CheckButton />
                            </td>
                            <td className={`${_CMNSTYLE_TD}`} >
                                <Icon type={status} />
                            </td>
                        </>
                    ) : null }
                    <td className={`${_CMNSTYLE_TD}`}>
                        {(mod) && 
                        <SelectInput 
                        searchFor={"cdbc"} 
                        value={cdbc}
                        onChange={(e) => setCdbc(e.target.value)} 
                        fixedW />}
                    </td>
                    <td className={`${_CMNSTYLE_TD}`}>
                        {(mod) && 
                        <SelectInput 
                        searchFor={"reason"} 
                        value={reason}
                        onChange={(e) => setReason(e.target.value)} 
                        fixedW />}
                    </td>
                    <td className={`${_CMNSTYLE_TD}`}>
                        {(mod) && <input 
                        type="number"
                        id="peso-pressista"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="Inserisci peso"
                        />}
                    </td>
                    <td className={`${_CMNSTYLE_TD}`}>
                        {(mod) && 
                        <SelectInput 
                        searchFor={"dest-wh"} 
                        value={dest_wh}
                        onChange={(e) => setDestWh(e.target.value)} 
                        fixedW />}
                    </td>
                    <td className={`${_CMNSTYLE_TD}`}>
                        {(mod) && <input 
                        type="text"
                        id="note-carrellista"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Inserisci note"
                        />}
                    </td>
                    <td className={`${_CMNSTYLE_TD}`} >
                        stato
                    </td>
                    {(primary) ? (
                        <td className={`${_CMNSTYLE_TD}`} >
                            <button 
                            className='on-btn-confirm'
                            onClick={() => { 
                                handleClick(false);
                                handleConfirmed();
                            }}
                            >
                                OK
                            </button>
                        </td>
                    ) : null }
                    <td className={`${_CMNSTYLE_TD}`}>
                        {/* DATA */}
                        {/* (mod) && <SelectInput searchFor={"plastic"} fixedW /> */}
                    </td>
                    <td className={`${_CMNSTYLE_TD}`}>
                        {/* ORA */}
                        {/* (mod) && <SelectInput searchFor={"plastic"} fixedW /> */}
                    </td>
                </tr>
            )
        }
    }
}
