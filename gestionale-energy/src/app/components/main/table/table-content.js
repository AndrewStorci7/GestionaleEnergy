import { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import CheckButton from "../select-button";
import Icon from "../get-icon";
import InsertNewBale from '../insert-new-bale';
import Alert from '../alert';

import { useWebSocket } from "@@/components/main/ws/use-web-socket";
import { refreshPage, getServerRoute, getBgColor } from '@/app/config';

/**
 * Custom component for handling the data of a bale
 * 
 * @param {string}      type    [ `presser` | `wheelman` | `both` | `admin` ]
 *                              Il tipo della pagina
 * 
 * @param {Object}      add     Oggetto che contiene lo stato di add e la funzione che gestisce il suo cambiamento 
 *                              [ `true` | `false` ]
 *                              True se il bottone di aggiunta è stato premuto, altrimenti false
 * 
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
    type, 
    add,
    useFor = 'regular', 
    noData, 
    handleSelect,
    primary = false, 
    tableChange = false,
    handleError,
    selectedBaleId
    
}) {
    // WebSocket instance
    const { ws, message } = useWebSocket();

    const _CMNSTYLE_TBODY = "bg-white dark:bg-slate-800";
    const _CMNSTYLE_TD = "border-b border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400";

    const [content, setContent] = useState([]);
    const [isEmpty, setEmpty] = useState(false);
    const [openNotes, setOpenNotes] = useState({}); 
    const [noteMessage, setNoteMessage] = useState("");

    const selectedBaleIdRef = useRef([]);

    const handleNoteClick = (id, note) => {
        setNoteMessage(note);
        setOpenNotes(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleCloseNote = id => setOpenNotes(prev => ({ ...prev, [id]: false }));

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
    
    const fetchData = async () => {
        try {
            const cookies = JSON.parse(Cookies.get('user-info'));
            const body = { id_implant: cookies.id_implant, useFor };
            const url = getServerRoute("bale");
    
            const resp = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ body }),
            });
    
            if (!resp.ok) throw new Error("Network response was not ok");
    
            const data = await resp.json();
            if (data.code === 0) {
                setEmpty(false);
    
                // Assicurati di assegnare i dati da presser a wheelman
                if (data.presser && Array.isArray(data.presser) && data.presser.length > 0) {
                    data.presser.map((bale, index) => {
                        data.wheelman[index].plasticPresser = bale.plastic; 
                    });
                }
    
                // Popola il contenuto con i dati appropriati
                setContent(type === "presser" ? data.presser : type === "wheelman" ? data.wheelman : []);
            } else {
                setEmpty(true);
                noData && noData(data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };
    
    
    useEffect(() => { fetchData(); }, [message]);

    const handleRowClick = (id, idUnique) => {
        const newSelectedBaleId = selectedBaleId === id ? null : id;
        selectedBaleIdRef.current = newSelectedBaleId;
        handleSelect(newSelectedBaleId, idUnique);
    };

    return (
        <tbody 
        className="bg-white dark:bg-slate-800 overflow-y-scroll"
        // className={`text-black ${primary ? "cursor-auto" : "cursor-no-drop"} ${getBgColor(type)}`}
        >            
            {useFor === 'regular' && add.state && (
                <InsertNewBale style={_CMNSTYLE_TD} type={type} mod={primary} primary={primary} confirmHandle={handleAddChange} />
            )}

            {!isEmpty && content.map((bale, index) => {
                const plastic = bale.plasticPresser;
                const id = bale.id;
                const idUnique = bale.idUnique;
                const date = bale.data_ins?.substr(0, 10).replaceAll('-', '/') || "";
                const hour = bale.data_ins?.substr(11, 8) || "";
                const status = bale.status === 0 ? "working" : bale.status === 1 ? "completed" : "warning";
                
                return (
                    <tr key={idUnique} data-bale-id={id} 
                    // className="border border-slate-400 h-[40px]"
                    >
                        {primary && (
                            <>
                                <td key={idUnique + "_checkbtn"} className={_CMNSTYLE_TD}>
                                    {(useFor === 'regular' || useFor === 'reverse') && (
                                        <CheckButton isSelected={selectedBaleId === id} handleClick={() => handleRowClick(id, idUnique)} />
                                    )}
                                </td>
                                <td className={`font-bold ${_CMNSTYLE_TD}`} >{idUnique}</td>
                                <td><Icon type={status} /></td>
                                {type === 'wheelman' ? <td className={_CMNSTYLE_TD}>{plastic}</td> : <></>}
                            </>
                        )}
                        {Object.entries(bale).map(([key, value]) => (
                            key.startsWith("_") || ["id", "status", "idUnique", "plasticPresser"].includes(key) ? null : (
                                key === "notes" && value ? (
                                    <td key={idUnique + key} className={_CMNSTYLE_TD}>
                                        <button className="w-auto p-[6px] mx-[10%] w-[80%]" onClick={() => handleNoteClick(id, value)}>
                                            <Icon type="info" /> 
                                        </button>
                                    </td>
                                ) : (key === "is_printed") ? (
                                    <td key={idUnique + key} className={`font-bold ${_CMNSTYLE_TD}`}>{value == 0 ? "Da stamp." : "Stampato"}</td>
                                ) : (key !== "data_ins") ? (
                                    <td key={idUnique + key} className={_CMNSTYLE_TD}>{value}</td>
                                ) : null
                            )
                        ))}   
                        <td className="relative" key={idUnique + "_note"}>
                            {openNotes[id] && <Alert msg={noteMessage} alertFor="note" handleClose={() => handleCloseNote(id)} />}
                        </td>
                        <td>{date}</td>
                        <td>{hour}</td>
                        
                    </tr>
                );
            })}
        </tbody>
    );
}