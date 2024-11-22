import getEnv from '@@/config';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import CheckButton from "../select-button";
import Icon from "../get-icon";

const URL = getEnv('srvurl');
const PORT = getEnv('srvport');
const srvurl = `${URL}:${PORT}`;
const prova = Cookies.get('user-info').id_user
console.log("ID : " + prova)

/**
 * Custom component for handling the data of a bale
 * 
 * @param {string}  type    [ 'presser' | 'wheelman' | 'both' | 'admin' ]
 *                          Il tipo della pagina
 * @param {boolean} primary Serve per settare correttamente il colore dello sfondo   
 * 
 * @returns
 */
export default function TableContent({ type, primary = false }) {

    const _CMNSTYLE_TBODY = (primary) ? "bg-secondary text-black" : "bg-gray-200 text-black";

    // const [idUser, setIdUser] = useState();
    // const [url, setUrl] = useState("");
    const [content, setContent] = useState([]);
    const [error, setError] = useState("");

    // TODO
    // Creare una componente custom che permetta di gestire in maniera dinamica
    // il contenuto delle varie balle, differenziato da 'presser' e 'wheelman'.
    // I dati dovranno essere presi tramite un fetch alla rotte:
    // - `/presser`
    // - `/wheelman`

    const getUrl = (type) => {

        type = ''

        switch (type) {
            case 'admin':
                return srvurl + "/admin"
            case 'presser':
                return srvurl + "/presser"
            case 'wheelman':
                return srvurl + "/wheelman"
            case 'both':
                return srvurl + "/both" 
            default:
                return srvurl + "/presser"
        }
    } 
    
    useEffect(() =>  {
        const fetchData = async () => {
            try {
                const cookies = await JSON.parse(Cookies.get('user-info'));
                const id_user = cookies.id_user; 
                const url = getUrl(type)
                
                const resp = await fetch(url, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ id_user }),
                });

                if (!resp.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await resp.json();
                
                if (data.code === 0)
                    setContent(data.data);
                else
                    setError(data.message);                

            } catch (error) {
                // Handle error
            }
        }

        fetchData();
    }, [type]);

    return (
        <tbody className={_CMNSTYLE_TBODY}>
            {(error === "") ?  
                content.map((_m, _i) => (
                    <tr key={_i}>
                        {(primary) ? 
                            <>
                                <td key={"check_btn" + _i}><CheckButton /></td>
                                <td key={"status" + _i}><Icon type={"completed"} /></td>
                            </>
                        :
                            null
                        }
                        {Object.keys(_m).map((key, __i) => (
                            (key === "data_ins") ? (
                                <>
                                    {/* estraggo la data */}
                                    <td key={"data" + _i + __i}>
                                        {_m[key]}
                                    </td>
                                    {/* estraggo l'ora */}
                                    <td key={"hour" + _i + __i}>
                                        {_m[key].get}
                                    </td>
                                </>
                            ) : (
                                <td key={key + _i + __i} value={_m[key]}>{_m[key]}</td>
                            )
                        ))}
                        <td key={"confirme" + _i}>
                            {(primary) ? 
                                null
                            :
                                null
                            }
                        </td>
                    </tr>
                ))
            : null
            }
        </tbody>
    )
}