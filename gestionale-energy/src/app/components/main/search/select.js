import { getSrvUrl } from "@/app/config";
import { useEffect, useState } from "react";

const srvurl = getSrvUrl()

/**
 * 
 * @author Andrea Storci from Oppimittinetworking
 * 
 * @param {string} searchFor      [ Ricerca per
 *                                  'status'        => Stato lavorazione 
 *                                  'plastic'       => Tipo o codice plastica 
 *                                  'cdbc'          => Condizione balla carrellista
 *                                  'cdbp'          => Condizione balla pressista
 *                                  'dest-wh'       => magazzino di destinazione
 *                                  'rei'           => Utilizzo REI
 *                                  'selected-b'    => Balla selezionata
 *                                ]
 * @param {string} id     
 *  
 * @returns 
 */
export default function SelectInput({ searchFor, id, type }) {

    const _CMNSTYLE_SELECT = "rounded-md"

    // Rotta per server
    const [error, setError] = useState("")
    // Risposta ottenuta dal server
    const [content, setContent] = useState([])

    const getUrl = (searchFor) => {
        switch (searchFor) {
            case "status":
                return -1
            case "plastic":
                return srvurl + "/plastic"
            case "cdbc":
                return srvurl + "/cdbc"
            case "cdbp":
                return srvurl + "/cdbp"
            case "dest-wh":
                return srvurl + "/dest-wh"
            case "rei":
                return srvurl + "/rei"
            case "selected-b":
                return srvurl + "/selected-b"
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = getUrl(searchFor)

                console.log(url)

                if (url != -1) {
                    const resp = await fetch(url, {
                        method: 'GET',
                        headers: {'Content-Type': 'application/json'},
                    })
        
                    if (!resp.ok) {
                        throw new Error("Network response was not ok")
                    }
        
                    const data = await resp.json()
        
                    if (data.code === 0) {
                        setContent(data.data);
                    } else {
                        setError(data.message);
                    }
                } else {
                    setContent(["In lavorazione", "Cambiato", "Completato"])
                }

            } catch (error) {
                console.log(error)
            }
        }

        fetchData();
    }, [searchFor])

    return (
        <select
        id={id}
        className={`${_CMNSTYLE_SELECT}`}
        >
            <option value={""}>-</option>
            {content.map((_m, _i) => {
                if (typeof _m === "object" && _m !== null) {
                    let code = "";
                    let str = "";
                    let tmp = "";
                    Object.keys(_m).map((key, __i) => {
                        code = (key === "code") && _m[key];
                        tmp = (key === "desc") ? `\(${_m[key]}\)` : (key !== "plastic_type") ? _m[key] : "";
                        str += tmp + " "; 
                    })
                    return <option key={"object" + _i} value={code}>{str}</option>
                } else {
                    return <option key={_m + _i} value={_m}>{_m}</option>
                }
            })}
        </select>
    );
}