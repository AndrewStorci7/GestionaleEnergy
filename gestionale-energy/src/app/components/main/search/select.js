import { getServerRoute } from "@/app/config";
import { useEffect, useState } from "react";

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
export default function SelectInput({ 
    searchFor, 
    id, 
    fixedW, 
    value, 
    onChange, 
    isForSearch = false, 
    type,
    ...props 
}) {

    const fixed_width = (fixedW) && "w-full";
    const _CMNSTYLE_SELECT = `rounded-md ${fixed_width} text-black`;

    const [error, setError] = useState("");
    // Risposta ottenuta dal server
    const [content, setContent] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (searchFor === undefined || searchFor === null)
                    return;

                const url = await getServerRoute(searchFor);

                if (url != -1) {
                    const resp = await fetch(url, {
                        method: 'GET',
                        headers: {'Content-Type': 'application/json'},
                    });
        
                    if (!resp.ok) {
                        throw new Error("Network response was not ok");
                    }
        
                    const data = await resp.json();
        
                    if (data.code === 0) setContent(data.data);
                    else setError(data.message);
                } else {
                    setContent(["In lavorazione", "Cambiato", "Completato"]);
                }
            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
    }, [searchFor]);

    return (
        <select
            id={id}
            className={_CMNSTYLE_SELECT}
            value={value}
            onChange={onChange}
        >
            {isForSearch && <option value={""}>-</option>}

            {/* Iterate the content data */}
            {content.map((_m, _i) => {
                if (typeof _m === "object" && _m !== null) {

                    // Variabili locali 
                    let code = "";
                    let data = "";
                    let str = "";
                    let tmp = "";

                    // Controllo per impostare componente <option> correttamente:
                    // <option value={id}>name</option>
                    Object.keys(_m).map((key, __i) => {
                        code += (key === "code" || key === "id") ? _m[key] : "";
                        data = (key === "desc") ? _m[key] : "";
                        tmp = (key === "desc") ? `\(${_m[key]}\)` : (key !== "plastic_type" && key !== "id") ? _m[key] : "";
                        str += tmp + " "; 
                    });

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