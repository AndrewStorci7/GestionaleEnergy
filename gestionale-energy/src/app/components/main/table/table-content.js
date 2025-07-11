import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import Cookies from 'js-cookie';
import CheckButton from "../select-button";
import Icon from "../get-icon";
import InsertNewBale from '../insert-new-bale';
import { useAlert } from "@alert/alertProvider";

import { useWebSocket } from "@@/components/main/ws/use-web-socket";
import { refreshPage, getServerRoute, getBgColor } from '@/app/config';
import { fetchDataTotalBale } from '../fetch';

/**
 * Custom component for handling the data of a bale
 * 
 * @param {string}      type    [ `presser` | `wheelman` | `both` | `admin` ]
 *                              Il tipo della pagina
 * @param {Object}      add     Oggetto che contiene lo stato di add e la funzione che gestisce il suo cambiamento 
 *                              [ `true` | `false` ]
 *                              True se il bottone di aggiunta è stato premuto, altrimenti false
 * @param {Object}      useFor  [ `regular` | `specific` | `reverse` ]
 *                              Di default è impostato su `regolar`, ovvero, che stampa tutte le alle ancora in lavorazione.
 *                              Se invece viene impostato su `specific`, allora stamperà le balle completate.
 *                              Se impostato su `reverse` verranno stampate le balle al contrario.
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
    tableChange = false,
    handleError,
    selectedBaleId,
    style,
    ...props
}) {
    // WebSocket instance
    const { showAlert, hideAlert } = useAlert();
    const { ws, message } = useWebSocket();

    const [content, setContent] = useState([]);
    const [isEmpty, setEmpty] = useState(false);
    // const [changeWeight, canChangeWeight] = useState(false);
    const [editingWeightRowId, setEditingWeightRowId] = useState(null);
    const [newWeight, setWeight] = useState(0);
    const [cachedValued, cacheValue] = useState(0);

    const selectedBaleIdRef = useRef([]);

    const handleNoteClick = (id, note) => {
        showAlert({
            title: "Nota dell'utente",
            message: note,
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
            // add.setAdd();
            add.changeAddBtn();
        } else {
            // fai visualizzare l'alert con errore plastica vuota
            handleError();
        }
    };
    
    const safeType = useMemo(() => {
        if (!type || (type !== 'presser' && type !== 'wheelman')) {
            console.warn(`Invalid type in TableContent: ${type}, defaulting to 'presser'`);
            return 'presser';
        }
        return type;
    }, [type]);

    // Usa useCallback per evitare re-render non necessari
    const fetchData = useCallback(async () => {
        try {
            const cookies = JSON.parse(Cookies.get('user-info'));
            const body = { id_implant: cookies.id_implant, useFor };
            
            // Rimuovi la logica confusa di typeToFetch
            console.log(`Fetching data for type: ${safeType}, useFor: ${useFor}`);
            
            await fetchDataTotalBale(body, safeType, setContent, setEmpty, noData, showAlert);
        } catch (error) {
            console.error('Error fetching data:', error);
            showAlert({
                title: null,
                message: error.message,
                type: "error"
            });
        }
    }, [safeType, useFor, noData, showAlert]);

    // Separare gli useEffect per una migliore gestione
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Separare la gestione dei messaggi WebSocket
    useEffect(() => {
        if (message) {
            console.log('WebSocket message received, refreshing data...');
            fetchData();
        }
    }, [message, fetchData]);

    // Debug per verificare i valori
    useEffect(() => {
        console.log(`TableContent rendered with type: ${safeType}, useFor: ${useFor}, primary: ${primary}`);
    }, [safeType, useFor, primary]);

    const handleRowClick = (id, idUnique) => {
        const newSelectedBaleId = selectedBaleId === id ? null : id;
        selectedBaleIdRef.current = newSelectedBaleId;
        handleSelect(newSelectedBaleId, idUnique);
    };

    const updateWeightData = async (e, idUnique, bypassKeyDown) => {
        if (e.key === "Enter" || bypassKeyDown) {
            const url = getServerRoute("update-wheelman-bale");
            const fetch1 = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ weight: e.target.value, where: idUnique, }),
            });
            const check = await fetch1.json();
            // console.log(check);
        } else if (e.key === "Escape") {
            e.target.value = cachedValued;
        }

        setEditingWeightRowId(null);
    }

    return (
        <tbody className="bg-white dark:bg-slate-800 overflow-y-scroll">            
            {useFor === 'regular' && add.state && (
                <InsertNewBale style={style} type={type} mod={primary} primary={primary} confirmHandle={handleAddChange} />
            )}

            {!isEmpty && content.map((bale, index) => {
                const plastic = bale.plasticPresser;
                const id = bale.id;
                const idUnique = bale.idUnique;
                const date = bale.data_ins?.substr(0, 10).replaceAll('-', '/') || "";
                const hour = bale.data_ins?.substr(11, 8) || "";
                const status =  (bale.status === 1 && bale._idCwb === 2) ? "rei" : 
                                (bale.status === 0) ? "working" : 
                                (bale.status === 1) ? "completed" : "warning";
                
                return (
                    <tr key={idUnique} data-bale-id={id} className='max-h-[45px] h-[45px]'>
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
                                        <button onClick={() => handleNoteClick(id, value)}>
                                            <Icon type="info" /> 
                                            {/* {openNotes[id] && <Alert msg={noteMessage} alertFor="note" handleClose={() => handleCloseNote(id)} />} */}
                                        </button>
                                    </td>
                                ) : (key === "is_printed") ? (
                                    <td key={idUnique + key} className={style + " font-bold"}>{value == 0 ? "Da stamp." : "Stampato"}</td>
                                ) : (key === "weight") ? (
                                    <td 
                                        className={style}
                                        key={idUnique + key}
                                        // onDoubleClick={(e) => {
                                        //     cacheValue(e.target.value)
                                        //     setEditingWeightRowId(idUnique)
                                        // }}
                                    >
                                        {editingWeightRowId === idUnique ? (
                                            <input
                                                type="text"
                                                value={value}
                                                className="text-black w-full on-input"
                                                // onChange={(e) => {
                                                //     setWeight(e.target.value);
                                                //     // aggiorna localmente, puoi anche salvarlo in uno stato per poi inviarlo
                                                //     const updatedContent = [...content];
                                                //     const rowIndex = updatedContent.findIndex(row => row.idUnique === idUnique);
                                                //     if (rowIndex !== -1) {
                                                //         updatedContent[rowIndex][key] = e.target.value;
                                                //         // setContent(updatedContent);
                                                //     }
                                                // }}
                                                // onKeyDown={(e) => {
                                                //     // salva dato su db
                                                //     // se preme 'Enter' salva, se preme 'Esc' non salva
                                                //     if (e.key === 'Enter')
                                                //         updateWeightData(e, idUnique, false);
                                                //     else if (e.key === 'Escape') 
                                                //         updateWeightData(e, idUnique, false);
                                                // }}
                                                // onBlur={(e) => {
                                                //     // aggiorna dato peso sul db
                                                //     updateWeightData(e, idUnique, true);
                                                // }} // chiudi l'input quando esce dal focus
                                            />
                                        ) : value}
                                    </td>
                                ) : (key !== "data_ins") ? (
                                    <td key={idUnique + key} className={style}>{value}</td>
                                ) : null
                            )
                        ))}
                        {primary && <td className={style}></td>}  
                        <td className={style + " font-bold"}>{date}</td>
                        <td className={style + " font-bold"}>{hour}</td>
                    </tr>
                );
            })}
        </tbody>
    );
}