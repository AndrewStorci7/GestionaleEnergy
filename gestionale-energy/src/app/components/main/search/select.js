import React, { useEffect, useState } from "react";
import { getServerRoute } from "@config";
// import { useAlert } from "@alert/alertProvider";

import PropTypes from 'prop-types'; // per ESLint

/**
 * 
 * @author Andrea Storci from Oppimittinetworking
 * 
 * @param {boolean}  disabled
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
function SelectInput({ 
    disabled,
    searchFor, 
    id, 
    fixedW, 
    value, 
    onChange, 
    isForSearch = false
}) {

    const fixed_width = (fixedW) && "w-full";
    const _CMNSTYLE_SELECT = `rounded-md ${fixed_width} text-black border-2 border-gray-300 p-1`;

    // Risposta ottenuta dal server
    const [content, setContent] = useState([]);
    // const { showAlert } = useAlert();

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (searchFor === undefined || searchFor === null)
                    return;

                const url = getServerRoute(searchFor);

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
                } else {
                    setContent(["In lavorazione", "Cambiato", "Completato"]);
                }
            } catch (error) {
                console.log(error.message || "Failed to fetch data");
                // showAlert({
                //     title: "Error",
                //     message: error.message || "Failed to fetch data",
                //     type: "error",
                // });
            }
        }

        fetchData();
    }, [searchFor]);

    return (
        <select
            disabled={disabled}
            id={id}
            className={_CMNSTYLE_SELECT}
            value={value}
            onChange={onChange}
        >
            {(isForSearch || searchFor === "plastic") && <option value={""}>-</option>}

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
                    Object.keys(_m).map((key) => {
                        code += (key === "code" || key === "id") ? _m[key] : "";
                        data = (key === "desc") ? _m[key] : "";
                        tmp = (key === "desc") ? `(${_m[key]})` : (key !== "plastic_type" && key !== "id") ? _m[key] : "";
                        str += tmp + " "; 
                    });

                    return <option key={"option-" + _i} value={code} data-code={data}>{str}</option>
                } else {
                    return <option key={_m[_i] + _i} value={_m}>{_m}</option>
                }
            })}
        </select>
    );
}

SelectInput.propTypes = {
    disabled: PropTypes.bool,
    searchFor: PropTypes.string,
    id: PropTypes.string.isRequired,
    fixedW: PropTypes.bool,
    value: PropTypes.any,
    onChange: PropTypes.func,
    isForSearch: PropTypes.bool
};

export default React.memo(SelectInput);