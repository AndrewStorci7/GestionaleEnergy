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
 * @param {Function}    onCHange 
 * @param {Object}      ref
 * @param {*}           props
 */
export default function SelectImplants({ 
    onChange, 
    ref, 
    ...props
}) {

    const [content, setContent] = useState([])
    const { showAlert } = useAlert();

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
    }, [onChange])
    
    return (
        <select
            ref={ref}
            onChange={onChange}
            {...props}
        >
            <option value={""}>Seleziona un&apos;impianto</option>
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