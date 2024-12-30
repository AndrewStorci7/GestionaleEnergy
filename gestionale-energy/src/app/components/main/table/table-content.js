import { getSrvUrl } from '@@/config';
import { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import CheckButton from "../select-button";
import Icon from "../get-icon";
import InsertNewBale from '../insert-new-bale';
import ErrorAlert from '../error-alert';

const srvurl = getSrvUrl()

/**
 * Custom component for handling the data of a bale
 * 
 * @param {string}  type    [ 'presser' | 'wheelman' | 'both' | 'admin' ]
 *                          Il tipo della pagina
 * 
 * @param {boolean} add     [ true | false ]
 *                          True se il bottone di aggiunta è stato premuto, altrimenti false
 * 
 * @param {object}  ids     Oggetto contenente gli ID delle balle create
 *                          L'oggeto sarà null se il bottone aggiungi non è stato cliccato
 * 
 * @param {function}noData  Funzione che aggiorna lo stato della variabile noData.
 *                          Serve per far visualizzare il messaggio "Nessun dato" nel caso in cui non vengano restituiti dati dal database
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

    const _CMNSTYLE_TBODY = (primary) ? "text-black" : "bg-gray-200 text-black opacity-50";
    const _CMNSTYLE_TD = "border border-slate-400 h-[40px] ";
    const _CMN_CURSOR = (primary) ? "cursor-auto" : "cursor-no-drop";

    const [changeFromAdd, setChangeFromAdd] = useState(false) 
    const [content, setContent] = useState([]);
    const [isEmpty, setEmpty] = useState(false)

    const [openNotes, setOpenNotes] = useState({}); // Track open notes by their ID
    const [showNote, setShowNote] = useState(false);  // state to show the note

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
        setNoteMessage(note);
        setOpenNotes(prev => ({ ...prev, [id]: true })); 
    };

    const handleCloseNote = (id) => {
        setOpenNotes(prev => {
            const newState = { ...prev };
            delete newState[id]; 
            return newState;
        });
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
        setChangeFromAdd(!changeFromAdd)
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
                    setEmpty(!isEmpty);
                    noData(data.message);
                }
            } catch (error) {
                console.log(error)
            }
        }

        fetchData();
    }, [type, changeFromAdd]);

    // test
    let i = 0;

    // const [selectedBale, setSelectedBale] = useState(null)

    const handleRowClick = (id) => {
        console.log("table-content: " + id + ", current bale selected: " + selectedBaleId)
        const newSelectedBaleId = (selectedBaleId === id ? null : id)
        // setSelectedBale(newSelectedBaleId)
        handleSelect(newSelectedBaleId)

        console.log("table-content after: " + newSelectedBaleId)
    };

    return (
        <tbody className={`${_CMNSTYLE_TBODY} ${_CMN_CURSOR} ${_CMNSTYLE_TD} ${getBgColor(type)}`}>
            {(add) && ( 
                <InsertNewBale type={type} mod={primary} ids={ids} primary={primary} confirmHandle={handleAddChange} />
            )}
            {(!isEmpty) ? (
                content.map((_m, _i) => {

                    // Variabili locali
                    let date = "";
                    let hour = "";
                    let id = 0;
                    ++i;

                    Object.keys(_m).map((key, __i) => {
                        if (key === "id") {
                            id = _m[key]
                        } else if (key === "data_ins") {
                            date = _m[key].substr(0, 10).replaceAll('-', '/');
                            hour = _m[key].substr(11, 8);
                        }
                        {/*if (key==="notes")
                                console.log(_m[key])*/}
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
                                        <Icon type={(i <= 3) ? "info" : "completed"} />
                                    </td>
                                </>
                            )}
                            {Object.keys(_m).map((key, __i) => (
                                (key === "notes") ? (
                                    (_m[key] !== "" && _m[key] !== null) ? 
                                        <button className="w-auto p-[6px] mx-[10%] w-[80%]" key={key + _i +__i} onClick={() => handleNoteClick(id, _m[key])}>
                                            <Icon type="info"/>
                                        </button>
                                    : <td></td>
                                ) : (key == "id") ? (
                                    null
                                ) : (key === "is_printed") ? (
                                    <td className={`${_CMNSTYLE_TD} font-bold`} key={key + _i + __i} value={_m[key]}>
                                        {(_m[key] == 0) ? "Stampato" : "Da stamp."}
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