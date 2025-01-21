import { getSrvUrl } from '@@/config';
import { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import CheckButton from "../select-button";
import Icon from "../get-icon";
import InsertNewBale from '../insert-new-bale';
import Alert from '../alert';

import { useWebSocket } from "@@/components/main/ws/use-web-socket";

const srvurl = getSrvUrl()

/**
 * Custom component for handling the data of a bale
 * 
 * @param {string}  type    [ 'presser' | 'wheelman' | 'both' | 'admin' ]
 *                          Il tipo della pagina
 * 
 * @param {Object}  add     Oggetto che contiene lo stato di add e la funzione che gestisce il suo cambiamento 
 *                          [ true | false ]
 *                          True se il bottone di aggiunta è stato premuto, altrimenti false
 * 
 * @param {Object}  ids     Oggetto contenente gli ID delle balle create
 *                          L'oggeto sarà null se il bottone aggiungi non è stato cliccato
 * 
 * @param {Function}noData  Funzione che aggiorna lo stato della variabile noData.
 *                          Serve per far visualizzare il messaggio "Nessun dato" nel caso in cui non vengano restituiti dati dal database
 * 
 * @param {Function}    handleSelect    Accetta una funzione che gestisce la selezione di una balla    
 * 
 * @param {boolean} primary Serve per settare correttamente il colore dello sfondo
 * 
 * @param {boolean} tableChanged    Serve per ricaricare la componente quando viene effettuata una modifica, eliminazione o aggiunta
 * 
 * @returns
 */
export default function TableContent({ 
    type, 
    add,
    ids, 
    noData, 
    handleSelect,
    primary = false, 
    tableChange = false,
    selectedBaleId
}) {

    const { ws, message } = useWebSocket();

    const _CMNSTYLE_TBODY = (primary) ? "text-black" : "bg-gray-200 text-black opacity-50";
    const _CMNSTYLE_TD = "border border-slate-400 h-[40px] ";
    const _CMN_CURSOR = (primary) ? "cursor-auto" : "cursor-no-drop";

    const [changeFromAdd, setChangeFromAdd] = useState(false) 
    const [content, setContent] = useState([]);
    const [isEmpty, setEmpty] = useState(false)

    const [openNotes, setOpenNotes] = useState({}); // Track open notes by their ID
    //const [showNote, setShowNote] = useState(false);  // state to show the note

    const [noteMessage, setNoteMessage] = useState(""); // state to hold note message

    /**
     * Get Background Color
     * 
     * @param {string} type 
     * @returns 
     */
    const getBgColor = (type) => {
        switch (type) {
            case 'admin':
                return "bg-primary_2" 
            case 'presser':
                return "bg-primary_2" 
            case 'wheelman':
                return "bg-secondary_2" 
            case 'both':
                return "bg-secondary_2" 
            default:
                return "bg-primary_2"
        }
    }

    const handleNoteClick = (id, note) => {
        // Impostare il messaggio della nota
        setNoteMessage(note);
    
        // Aggiornare lo stato di openNotes in modo idempotente
        setOpenNotes(prev => {
            // Non modificare se lo stato è già aggiornato come previsto
            const newState = { ...prev, [id]: !prev[id] };
    
            // Stampa per il debugging
            console.log("Toggling note for ID", id, "New state:", newState);
    
            return newState;
        });
    
        // Log per il contenuto e la richiesta dei dati
        console.log("Rendering rows for content", content);
        
        console.log("Fetching data...");
    };
    
    

    const handleCloseNote = (id) => {
        setOpenNotes(prev => ({ ...prev, [id]: false })); // Imposta su false per chiudere
    };

    /**
     * Get Url of route
     * 
     * @param {string} type 
     * @returns 
     */
    const getUrl = () => {
        return srvurl + '/bale';
    } 

    const handleAddChange = () => {
        // console.log("handlechange from table-content UPDATED")
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({ type: "reload", data: "___update___" })
            ws.current.send(message);
        } else {
        console.log('WebSocket is not connected');
        }
        add.setAdd()
        setChangeFromAdd(prev => !prev)
    } 
    
    useEffect(() =>  {
        const fetchData = async () => {
            try {
                const cookies = await JSON.parse(Cookies.get('user-info'));
                const id_implant = cookies.id_implant;
                const url = getUrl()
                
                const resp = await fetch(url, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ id_implant }),
                });

                if (!resp.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await resp.json();

                console.log(data)

                if (data.code === 0) {
                    if (type === "presser")
                        setContent(data.presser)
                    else if (type === "wheelman")
                        setContent(data.wheelman)
                    else
                        setContent([])
                } else {
                    setEmpty(prev => !prev);
                    if (noData) noData(data.message);
                    // return;
                }
            } catch (error) {
                console.log(error)
            }
        }

        fetchData();
    }, [type, add, changeFromAdd, message]);

    // test
    let i = 0;

    // const [selectedBale, setSelectedBale] = useState(null)

    const selectedBaleIdRef = useRef([]);

    const handleRowClick = (id) => {
        // console.log("table-content: " + id + ", current bales selected: " + selectedBaleIdRef.current);
    
        // Ensure selectedBaleIdRef.current is initialized as an array
        if (!Array.isArray(selectedBaleIdRef.current)) {
            selectedBaleIdRef.current = [];
        }
    
        // Check if the id is already in the selectedBaleIdRef array
        const newSelectedBaleId = selectedBaleIdRef.current.includes(id)
            ? selectedBaleIdRef.current.filter(baleId => baleId !== id)  // Remove the id if it's already selected
            : [...selectedBaleIdRef.current, id];  // Add the id to the array if it's not selected
    
        // Update the ref with the new array of selected bale IDs
        selectedBaleIdRef.current = newSelectedBaleId;
    
        handleSelect(newSelectedBaleId);
    
        // console.log("table-content after: " + JSON.stringify(newSelectedBaleId));
    };

    return (
        <tbody className={`${_CMNSTYLE_TBODY} ${_CMN_CURSOR} ${_CMNSTYLE_TD} ${getBgColor(type)}`}>
            {(add.state) && ( 
                <InsertNewBale type={type} mod={primary} ids={ids} primary={primary} confirmHandle={handleAddChange} />
            )}
            {(!isEmpty) ? (
                content.map((_m, _i) => {

                    // Variabili locali
                    let date = "";
                    let hour = "";
                    let id = 0;
                    var status = "";
                    ++i;

                    Object.keys(_m).map((key, __i) => {
                        if (key === "id") {
                            id = _m[key]
                        } else if (key === "data_ins") {
                            date = _m[key].substr(0, 10).replaceAll('-', '/');
                            hour = _m[key].substr(11, 8);
                        } else if (key === "status") {
                            //Se il valore è 0, Lavorazione(working), Se il valore è 1, Stampato(completed), Se il valore è -1 (warning)
                            if (_m[key] === 0) status = "working"
                            else if (_m[key] === 1) status = "completed"
                            else status = "warning"
                        }
                    })

                    return (
                        <tr className={`${_CMNSTYLE_TD} `} key={_i} data-bale-id={id}> 
                            {(primary) && (
                                <>
                                    <td className={`${_CMNSTYLE_TD}`} key={"check_btn" + _i}>
                                        <CheckButton 
                                        isSelected={(selectedBaleId === id)}
                                        handleClick={() => handleRowClick(id)} />
                                    </td>
                                    <td className={`${_CMNSTYLE_TD}`} key={"status" + _i}>
                                        <Icon type={status} />
                                    </td>
                                </>
                            )}
                            {Object.keys(_m).map((key, __i) => (
                                (key.startsWith("_") || key == "id" || key == "status" ) ? (
                                    null
                                ) : (key === "notes") ? (
                                    (_m[key] !== "" && _m[key] !== null) ?
                                    <td>
                                        <button className="w-auto p-[6px] mx-[10%] w-[80%]" key={key + _i +__i} onClick={() => handleNoteClick(id, _m[key])}>
                                            <Icon type="info"/> 
                                        </button>
                                    </td> 
                                    : <td></td>
                                ) : (key === "is_printed") ? (
                                    <td className={`${_CMNSTYLE_TD} font-bold`} key={key + _i + __i} value={_m[key]}>
                                        {(_m[key] == 0) ? "Da stamp." : "Stampato"}
                                    </td>
                                ) : (key !== "data_ins") ? (
                                    <td className={`${_CMNSTYLE_TD}`} key={key + _i + __i} value={_m[key]}>{_m[key]}</td>
                                ) : null
                            ))}
                            {(primary) && (
                                <td className={`${_CMNSTYLE_TD} relative`} key={"confirm" + _i}>
                                    <button 
                                    className='on-btn-confirm'
                                    onClick={() => console.log("TODO")}
                                    >
                                        OK
                                    </button>
                                    {openNotes[id] && (
                                    <Alert msg={noteMessage} alertFor="note" handleClose={() => handleCloseNote(id)} />
                                )}
                                </td>
                            )}
                            {/* Data */}
                            <td className={`${_CMNSTYLE_TD}`} key={"data" + _i}>{date}</td>
                            {/* Ore */}
                            <td className={`${_CMNSTYLE_TD}`} key={"hour" + _i}>{hour}</td>
                        </tr>
                    )
                })
            ) : null }
        </tbody>
    )
}