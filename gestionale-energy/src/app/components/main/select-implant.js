/**
 * Select component that display the available implants
 * 
 * @author Andrea Storci from Oppimittinetworking
 */

'use client';

import { getSrvUrl } from '@/app/config';
import React, { useEffect, useState } from 'react'

const srvurl = getSrvUrl();

export default function SelectImplants({ onChange }, props) {
    
    // const _CMNSTYLE_SELECT = "rounded-md"

    const [content, setContent] = useState([])
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await fetch(srvurl + "/implants", {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'},
                });
                const res = await resp.json();

                if (res.code === 0) {
                    setContent(res.data)
                } else {
                    // TODO da cambiare con alert
                    setError(`Errore: ${error}`)
                }
            } catch (error) {
                // TODO da cambiare con alert
                setError(`Errore: ${error}`)
            }
        }

        fetchData();
    }, [onChange])
    
    return (
        <select
            onChange={onChange}
            {...props}
        >
            <option value={""}>Seleziona un&apos;impianto</option>
            {content.map((_m, _i) => {
                let value = "", text = "";
                console.log()
                
                Object.keys(_m).map((key, __i) => {
                    if (key === "id")
                        value = _m[key]
                    else text = _m[key]
                })
                
                return ( 
                    <option
                    key={value + text}
                    dataId={value}
                    value={text}
                    >
                        {text}
                    </option>
                )
            })}
        </select>
    )
}
