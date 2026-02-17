'use client';

import React, { useEffect, useState } from 'react'
import { getServerRoute } from '@config';
import { useAlert } from "@/app/components/main/alert/alertProvider";

import PropTypes from 'prop-types'; // per ESLint

/**
 * Select component that display the available implants
 *  
 * @author Andrea Storci from Oppimittinetworking.com
 * 
 * @param {number}      currentValue Valore di default della select
 * @param {boolean}     showDefaultValue Se `true` farà visualizzare il valore di defualt con valore "" (vuoto), altrimenti no
 * @param {Function}    onChange Funzione che si attiva quando avviene un cambio di selezione  
 * @param {Object}      ref Oggetto riferimento
 * @param {*}           props
 */
export default function SelectImplants({ 
    currentValue,
    showDefaultValue = true,
    onChange, 
    ref, 
    ...props
}) {

    const [value, setValue] = useState(currentValue);
    const [content, setContent] = useState([])
    const { showAlert, hideAlert } = useAlert();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = getServerRoute("implants");
                const resp = await fetch(url, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'},
                });
                const res = await resp.json();

                if (res.code === 0) {
                    setContent(res.data)
                } else {
                    showAlert({
                        title: "Error",
                        message: res.message,
                        type: "error",
                    });
                }
            } catch (error) {
                showAlert({
                    title: "Error",
                    message: error.message || "Failed to fetch implants",
                    type: "error",
                });
            }
        }

        fetchData();
    }, [])

    useEffect(() => {
        console.log(currentValue)
        if (currentValue) {
            setValue(currentValue);
            // console.log(value);
        }
    }, [currentValue]);

    /**
     * Funzione per gestione cambio valore
     * 
     * @param {number} id ID dell'impianto 
     * @param {string} name Nome dell'impianto
     * @returns 
     */
    const handleChange = (id, name) => {
        if (id === "") {
            showAlert({
                title: "Non puoi selezionare quell'opzione",
                message: "L'opzione selezionata è solo a scopo informativo, devi selezionare un impianto valido",
                type: "error",
                onConfirm: hideAlert
            })
            return;
        }

        setValue(id);
        onChange?.(id, name)
    }

    return (
        <select
            ref={ref}
            onChange={(e) => handleChange(e.target.value, content[e.target.value - 1]?.name)}
            value={value}
            className={`rounded-md w-full text-black border-2 border-gray-300 p-1`}
            {...props}
        >
            {showDefaultValue && <option value={""}>Seleziona un&apos;impianto</option>}
            {content.map((_m) => {
                let value = "", text = "";
                
                Object.keys(_m).map((key) => {
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

SelectImplants.propTypes = {
    onChange: PropTypes.func.isRequired,
    ref: PropTypes.object
};