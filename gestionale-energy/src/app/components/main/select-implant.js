'use client';

import { getServerRoute } from '@@/config';
import React, { useEffect, useState } from 'react'

/**
 * Select component that display the available implants
 *  
 * @author Andrea Storci from Oppimittinetworking.com
 * 
 * @param {Function}    onCHange 
 * @param {Object}      ref
 * @param {*}           props
 */
export default function SelectImplants({ onChange, ref }, props) {

    const [content, setContent] = useState([])
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await fetch(getServerRoute("implants"), {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'},
                });
                const res = await resp.json();

                if (res.code === 0) {
                    setContent(res.data)
                } else {
                    // TODO da cambiare con alert
                    //setError(`Errore: ${error}`)
                    // <Alert msg={error}/>
                }
            } catch (error) {
                // TODO da cambiare con alert
                //setError(`Errore: ${error}`)
                // <Alert msg={error}/>
            }
        }

        fetchData();
    }, [onChange])
    
    return (
        <select
            ref={ref}
            // value={}
            onChange={onChange}
            {...props}
        >
            <option value={""}>Seleziona un&apos;impianto</option>
            {content.map((_m, _i) => {
                let value = "", text = "";
                
                Object.keys(_m).map((key, __i) => {
                    if (key === "id")
                        value = _m[key];
                    else text = _m[key];
                })
                
                return ( 
                    <option
                        key={value + text}
                        value={value}
                    >
                        {text}
                    </option>
                )
            })}
        </select>
    )
}

