import getEnv from '@@/config';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

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

    const [idUser, setIdUser] = useState(0);
    // const [url, setUrl] = useState("");
    const [content, setContent] = useState([]);

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
    
            const cookies = await JSON.parse(Cookies.get('user-info'));
            const id = cookies.id_user; 
            setIdUser(id)
            console.log(`TableContent: \n\tId User: ${idUser}`);
            const url = getUrl(type)

            console.log("url: " + url)
    
            try {
                console.log("qui1")
                const resp = await fetch(url, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ idUser }),
                });

                console.log("qui2")
                if (!resp.ok) {
                    throw new Error("Network response was not ok");
                }

                console.log("qui3")
                const data = await resp.json();
                setContent(data);

            } catch (error) {
                // Handle error
            }
        }

        fetchData();
    }, [type]);

    return (
        <tbody className={_CMNSTYLE_TBODY}>
            {/* idUser */}
            {content.map((_d, _i) => {
                console.log(_d, _i);
            })}
        </tbody>
    )
}