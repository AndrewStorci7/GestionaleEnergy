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
 * @param {Object}      useFor  [ `regular` | `specific` ]
 *                              Di default è impostato su `regolar`, ovvero, che stampa tutte le alle ancora in lavorazione.
 *                              Se invece viene impostato su `specific`, allora stamperà le balle completate. 
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
    selectedBaleId
    
}) {
    // WebSocket instance
    const { ws, message } = useWebSocket();

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

    const handleAddChange = async () => {
        refreshPage(ws);
        add.setAdd();
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

    const handleRowClick = id => {
        const newSelectedBaleId = selectedBaleId === id ? null : id;
        selectedBaleIdRef.current = newSelectedBaleId;
        handleSelect(newSelectedBaleId);
    };

    return (
        <tbody className={`text-black ${primary ? "cursor-auto" : "cursor-no-drop"} ${getBgColor(type)}`}>            
            {useFor === 'regular' && add.state && (
                <InsertNewBale type={type} mod={primary} primary={primary} confirmHandle={handleAddChange} />
            )}

            {!isEmpty && content.map((bale, index) => {
                const id = bale.id;
                const idUnique = bale.idUnique;
                const date = bale.data_ins?.substr(0, 10).replaceAll('-', '/') || "";
                const hour = bale.data_ins?.substr(11, 8) || "";
                const status = bale.status === 0 ? "working" : bale.status === 1 ? "completed" : "warning";

                return (
                    <tr key={index} data-bale-id={id} className="border border-slate-400 h-[40px]">
                        {primary && (
                            <>
                                <td>
                                    {useFor === 'regular' && (
                                        <CheckButton isSelected={selectedBaleId === id} handleClick={() => handleRowClick(id)} />
                                    )}
                                </td>
                                <td className="font-bold">{idUnique}</td>
                                <td><Icon type={status} /></td>
                            </>
                        )}
                        {Object.entries(bale).map(([key, value]) => (
                            key.startsWith("_") || ["id", "status", "idUnique"].includes(key) ? null : (
                                key === "notes" && value ? (
                                    <td key={key}>
                                        <button className="w-auto p-[6px] mx-[10%] w-[80%]" onClick={() => handleNoteClick(id, value)}>
                                            <Icon type="info" /> 
                                        </button>
                                    </td>
                                ) : key === "is_printed" ? (
                                    <td key={key} className="font-bold">{value == 0 ? "Da stamp." : "Stampato"}</td>
                                ) : key !== "data_ins" ? (
                                    <td key={key}>{value}</td>
                                ) : null
                            )
                        ))}
                        {primary && (
                            <td className="relative">
                                {/* <button className='on-btn-confirm' onClick={() => console.log("TODO")}>OK</button> */}
                                {openNotes[id] && <Alert msg={noteMessage} alertFor="note" handleClose={() => handleCloseNote(id)} />}
                            </td>
                        )}
                        <td>{date}</td> {/* DATA */}
                        <td>{hour}</td> {/* ORA */}
                    </tr>
                );
            })}
        </tbody>
    );
}