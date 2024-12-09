'use-client';

import { getSrvUrl } from '@/app/config'
import React, { useState } from 'react'
import CheckButton from "./select-button"
import Icon from './get-icon';
import SelectInput from './search/select'
import Cookies from 'js-cookie';

const srvurl = getSrvUrl();

/**
 * Compoent used only by type 'presser' and 'wheelman'
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
 * @returns 
 */
export default function InsertNewBale({ type, mod, ids, primary }) {
    
    console.log("IDS: ", ids)

    const _CMNSTYLE_TD = "border border-slate-400 h-[40px]";

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

    /**
     * 
     * 
     * @param {int} f 
     */
    const handleClick = (f) => {
        try {
            // console.log("Id pressista: " + ids.id_presser_bale + ", Id carrellista: " + ids.id_wheelman_bale)

            const cookie = JSON.parse(Cookies.get('user-info'));
            let url = "";
            let body = {};
            if (f) {
                url = srvurl + "/upresserbale";
                body = {
                    id_user: cookie.id_user,
                    id_plastic: plastic,
                    id_rei: rei,
                    id_cpb: cdbp,
                    id_sb: selected_b,
                    note: note,
                    where: ids.id_presser_bale || 0,
                }
            } else { 
                url = srvurl + "/uwheelmanbale";
                body = {
                    id_user: cookie.id_user,
                    id_cwb: cdbc,
                    id_rnt: reason,
                    id_wd: dest_wh,
                    isPrinted: false, // Da modificare
                    note: note,
                    weight: weight,
                    where: ids.id_wheelman_bale || 0,
                }
            }

            const resp = fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ body })
            })

            if (!resp.ok) {
                //ErrorAlert
                console.log("Errore")
            }

        } catch (error) {
            console.log("Errore")
        }
    }

    switch (type) {
        case "presser": {
            return (
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
                            className='w-full bg-gray-300 font-bold p-[3px] m-[6px] w-[60px]'
                            onClick={() => handleClick(true)}
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
        case "wheelman": {
            return (
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
                        placeholder="Inserisci note"
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
                            className='w-full bg-gray-300 font-bold p-[3px] m-[6px] w-[60px]'
                            onClick={() => handleClick(false)}
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
