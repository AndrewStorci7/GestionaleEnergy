import { getSrvUrl } from "@/app/config";
import { useEffect, useState } from "react";

const srvurl = getSrvUrl()

/**
 * 
 * @author Andrea Storci from Oppimittinetworking
 * 
 * @param {string}   searchFor   [ Ricerca per
 *                                  'status'        => Stato lavorazione 
 *                                  'plastic'       => Tipo o codice plastica 
 *                                  'cdbc'          => Condizione balla carrellista
 *                                  'cdbp'          => Condizione balla pressista
 *                                  'dest-wh'       => magazzino di destinazione
 *                                  'rei'           => Utilizzo REI
 *                                  'selected-b'    => Balla selezionata
 *                                  'reason'        => Motivazione
 *                               ]   
 * @param {string}   id          Id of the component
 * @param {boolean}  fixedW      Se true andrà a settare per default una larghezza fissa
 * @param {any}      value       Variabile nella quale salvare l'opzione selezionata
 * @param {function} onChange    Funzione che gestisce il salvataggio del dato
 *  
 * @returns 
 */
export default function SelectInput({ searchFor, id, fixedW, value, onChange, type }, props) {

    const fixed_width = (fixedW) && "w-full" 
    const _CMNSTYLE_SELECT = `rounded-md ${fixed_width}`

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
            case "implants":
                return  srvurl + "/implants"
            case "reason":
                return srvurl + "/reason"
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = getUrl(searchFor)

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
    }, [searchFor, value, onChange])

    return (
        <select
        id={id}
        className={`${_CMNSTYLE_SELECT}`}
        value={value}
        onChange={onChange}
        >
            <option value={""}>-</option>
            {content.map((_m, _i) => {
                if (typeof _m === "object" && _m !== null) {

                    // Variabili locali 
                    let code = "";
                    let data = ""
                    let str = "";
                    let tmp = "";

                    // Controllo per impostare componente <option> correttamente:
                    // <option value={id}>name</option>
                    Object.keys(_m).map((key, __i) => {
                        code += (key === "code" || key === "id") ? _m[key] : "";
                        data = (key === "desc") ? _m[key] : "";
                        tmp = (key === "desc") ? `\(${_m[key]}\)` : (key !== "plastic_type" && key !== "id") ? _m[key] : "";
                        str += tmp + " "; 

                        // console.log("Actual value: " + _m[key] + "\nValue saved: " + code)
                        // console.log("Value saved: ", code)
                    })

                    return ( 
                        <option key={"option-" + _i} value={code} data-code={data}>
                            {str}
                        </option>
                    )
                } else {
                    return (
                        <option key={_m[_i] + _i} value={_m}>
                            {_m}
                        </option>
                    )
                }
            })}
        </select>
    );
}