import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import Cookies from 'js-cookie';
import CheckButton from "../select-button";
import Icon from "../get-icon";
import InsertNewBale from '../insert-new-bale';
import { useAlert } from "@alert/alertProvider";

import { useWebSocket } from "@@/components/main/ws/use-web-socket";
import { refreshPage } from '@config';
import { fetchDataTotalBale } from '../fetch';

import PropTypes from 'prop-types'; // per ESLint

//commento di prova
/**
 * Custom component for handling the data of a bale
 * 
 * @param {string}      type    [ `presser` | `wheelman` | `both` | `admin` ]
 *                              Il tipo della pagina
 * @param {Object}      add     Oggetto che contiene lo stato di add e la funzione che gestisce il suo cambiamento 
 *                              [ `true` | `false` ]
 *                              True se il bottone di aggiunta è stato premuto, altrimenti false
 * @param {Object}      useFor  [ `regular` | `specific` | `reverse` ]
 *                              Di default è impostato su `regular`, ovvero, che stampa tutte le alle ancora in lavorazione.
 *                              Se invece viene impostato su `specific`, allora stamperà le balle completate.
 *                              Se impostato su `reverse` verranno stampate le balle al contrario in ordine di inserimento.
 * 
 * @param {Function}    noData  Funzione che aggiorna lo stato della variabile noData.
 *                              Serve per far visualizzare il messaggio "Nessun dato" nel caso in cui non vengano restituiti dati dal database
 * 
 * @param {Function}    handleSelect    Accetta una funzione che gestisce la selezione di una balla    
 * 
 * @param {boolean}     primary Serve per settare correttamente il colore dello sfondo
 * 
 * @param {boolean}     tableChanged    Serve per ricaricare la componente quando viene effettuata una modifica, eliminazione o aggiunta
 * 
 * @returns
 */
export default function TableContent({ 
    admin = false,
    type, 
    add,
    useFor = 'regular', 
    noData, 
    handleSelect,
    primary = false,
    handleError,
    selectedBaleId,
    style
}) {

    const { showAlert } = useAlert();
    const { ws, message } = useWebSocket();

    const [content, setContent] = useState([]);
    const [content1, setContent1] = useState([]);

    const [isEmpty, setEmpty] = useState(false);

    const selectedBaleIdRef = useRef([]);

    const handleNoteClick = (value) => {
        showAlert({
            title: "Nota dell'utente",
            message: value,
            type: "note"
        })
    };

    /**
     * 
     * @param {boolean} valid Se il parametro è true allora ricarica la pagina altrminet 
     */
    const handleAddChange = async (valid = true) => {
        if (valid) {
            refreshPage(ws);
            add.changeAddBtn();
        } else {
            handleError();
        }
    };
    
    const safeType = useMemo(() => {
        if (!type || (type !== 'presser' && type !== 'wheelman')) {
            // console.warn(`Invalid type in TableContent: ${type}, defaulting to 'presser'`);
            return 'presser';
        }
        return type;
    }, [type]);
    const Opposite = safeType === "presser" ? "wheelman" : "presser";
    const fetchData = useCallback(async () => {
        try {
            const cookies = JSON.parse(Cookies.get('user-info'));
            const body = { id_implant: cookies.id_implant, useFor };
            
            await fetchDataTotalBale(body, safeType, setContent, setEmpty, noData, showAlert);
            await fetchDataTotalBale(body, Opposite, setContent1, setEmpty, noData, showAlert);

        } catch (error) {
            console.error('Error fetching data:', error);
            showAlert({
                title: null,
                message: error.message,
                type: "error"
            });
        }
    }, [safeType, useFor, noData, showAlert]);

   

    useEffect(() => {
        fetchData();
    }, [message, fetchData]);

    const handleRowClick = (id, idUnique) => {
        const newSelectedBaleId = selectedBaleId === id ? null : id;
        selectedBaleIdRef.current = newSelectedBaleId;
        handleSelect(newSelectedBaleId, idUnique);
    };

    return (
        <tbody className="bg-white dark:bg-slate-800 overflow-y-scroll">            
            {useFor === 'regular' && add.state && (
                <InsertNewBale style={style} type={type} mod={primary} primary={primary} confirmHandle={handleAddChange} />
            )}

            {!isEmpty && content.length > 0 && content1.length > 0 && content.map((bale) => {
                const selectedBale = content1.find(bale1 => bale1.idUnique === bale.idUnique);
                const plastic = type === "wheelman" ? bale.plasticPresser : bale.plastic;
                const id = bale.id;
                const idUnique = bale.idUnique;
                const date = bale.data_ins?.substr(0, 10).replaceAll('-', '/') || "";
                const selectedDate = selectedBale?.data_ins?.substr(0, 10).replaceAll('-', '/') || "";
                const selectedHour = selectedBale?.data_ins?.substr(11, 8) || "";
                const hour = bale.data_ins?.substr(11, 8) || "";
                const status =  (bale.status === 1 && bale._idCwb === 2) ? "rei" : 
                                (bale.status === 0) ? "working" : 
                                (bale.status === 1) ? "completed" : "warning";
                const style1 = style + " bg-blue-200";
                console.log ("nuovo stile", style1);
                return (
                    <tr key={idUnique} data-bale-id={id} className={`max-h-[45px] h-[45px] ${plastic === "ALLUM." || plastic === "FERRO" ? "bg-gray-400" : "bg-gray-200"}`}>
                        {primary && (
                            <>
                                {!admin && 
                                    <td key={idUnique + "_checkbtn"} className={style}>
                                        {(useFor === 'regular' || useFor === 'reverse') && (
                                            <CheckButton isSelected={selectedBaleId === id} handleClick={() => handleRowClick(id, idUnique)} />
                                        )}
                                    </td>
                                }
                                <td className={style + " font-bold"} >{idUnique}</td>
                                <td className={style}><Icon type={status} /></td>
                                {type === 'wheelman' ? <td className={style}>{plastic}</td> : <></>}
                            </>
                        )}
                        {Object.entries(bale).map(([key, value]) => (
                            key.startsWith("_") || ["id", "status", "idUnique", "plasticPresser"].includes(key) ? null : (
                                key === "notes" && value ? (
                                    <td key={idUnique + key} className={style + " !p-1"}>
                                        <button onClick={() => handleNoteClick(value)}>
                                            <Icon type="info" /> 
                                        </button>
                                    </td>
                                ) : (key === "is_printed") ? (
                                    <td key={idUnique + key} className={style + " font-bold"}>{value == 0 ? "Da stamp." : "Stampato"}</td>
                                ) : (key === "weight") ? (
                                    <td 
                                        className={style}
                                        key={idUnique + key}
                                    >
                                        {value}
                                    </td>
                                ) : (key !== "data_ins") ? (
                                    <td key={idUnique + key} className={style}>{value}</td>
                                ) : null
                            )
                        ))}
                        {primary && <td className={style}></td>}
                        <td className={style + " font-bold"}>{date}</td>
                        <td className={style + " font-bold"}>{hour}</td>
                        {safeType === "presser" && (
                        <>
                        
                        <td className={style1 + " font-bold"}>{selectedBale?.condition || "-"}</td>
                        <td className={style1 + " font-bold"}>{selectedBale?.reason || "-"}</td>
                        <td className={style1 + " font-bold"}>{selectedBale?.weight || "-"}</td>
                        <td className={style1 + " font-bold"}>{selectedBale?.warehouse || "-"}</td>
                        <td className={style1 + " font-bold"}>{selectedBale?.note || "-"}</td>
                        <td className={style1 + " font-bold"}>{selectedBale?.is_printed ? "Stampato" : "Da stampare"}</td>
                        <td className={style1 + " font-bold"}>{selectedDate || "-"}</td>
                        <td className={style1 + " font-bold"}>{selectedHour ||"-"}</td>
                        </>)
                    }
                    {safeType === "wheelman" && (
                        <>
                        <td className={style1 + " font-bold"}>{selectedBale?.rei || "-"}</td>
                        <td className={style1 + " font-bold"}>{selectedBale.condition || "-"}</td>
                        <td className={style1 + " font-bold"}>{selectedBale?.selected_bale || "-"}</td>
                        <td className={style1 + " font-bold"}>{selectedBale?.notes || "-"}</td>
                        <td className={style1 + " font-bold"}>{selectedDate || "-"}</td>
                        <td className={style1 + " font-bold"}>{selectedHour || "-"}</td>
                        </>)
                    }
                    </tr>
                );
            })}
        </tbody>
    );
}

TableContent.propTypes = {
    admin: PropTypes.bool,
    type: PropTypes.string,
    add: PropTypes.object,
    useFor: PropTypes.string,
    noData: PropTypes.func,
    handleSelect: PropTypes.func,
    primary: PropTypes.bool,
    handleError: PropTypes.func,
    selectedBaleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    style: PropTypes.string
};