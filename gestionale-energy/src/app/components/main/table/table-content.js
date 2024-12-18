import { getSrvUrl } from '@@/config';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import CheckButton from "../select-button";
import Icon from "../get-icon";
import InsertNewBale from '../insert-new-bale';

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
 * @ run devparam {boolean} primary Serve per settare correttamente il colore dello sfondo   
 * 
 * @returns
 */
export default function TableContent({ type, add, ids, noData, primary = false }) {

    const _CMNSTYLE_TBODY = (primary) ? "text-black" : "bg-gray-200 text-black opacity-50";
    const _CMNSTYLE_TD = "border border-slate-400 h-[40px]";
    const _CMN_CURSOR = (primary) ? "cursor-auto" : "cursor-no-drop";

    const [content, setContent] = useState([]);
    const [isEmpty, setEmpty] = useState(false)

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
                return "bg-primary_2" //
        }
    }

    /**
     * Get Url of route
     * 
     * @param {string} type 
     * @returns 
     */
    const getUrl = () => {

        return srvurl + '/bale';

        switch (type) {
            case 'admin':
                return srvurl + "/admin"
            case 'presser':
                return srvurl + "/p-bale"
            case 'wheelman':
                return srvurl + "/w-bale"
            case 'both':
                return srvurl + "/both" 
            default:
                return srvurl + "/p-bale"
        }
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
    }, [type]);

    // test
    let i = 0;

    return (
        <tbody className={`${_CMNSTYLE_TBODY} ${_CMN_CURSOR} ${_CMNSTYLE_TD} ${getBgColor(type)}`}>
            {(add) && ( 
                <InsertNewBale type={type} mod={primary} ids={ids} primary={primary} />
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
                    })

                    return (
                        <tr className={`${_CMNSTYLE_TD}`} key={_i} data-bale-id={id}>
                            {(primary) && (
                                <>
                                    <td className={`${_CMNSTYLE_TD}`} key={"check_btn" + _i}><CheckButton /></td>
                                    <td className={`${_CMNSTYLE_TD}`} key={"status" + _i}><Icon type={(i <= 3) ? "info" : "completed"} /></td>
                                </>
                            )}
                            {Object.keys(_m).map((key, __i) => (
                                (key == "id") ? (
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
                                    className='w-full bg-gray-300 font-bold p-[3px] mx-[10%] w-[80%]'
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