'use client';

import React, { useState, useEffect, useTransition } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { getSrvUrl } from '@@/config';
import Cookies from 'js-cookie';
import CheckCookie from "@/app/components/main/check-cookie";

const srvurl = getSrvUrl();

export default function Contatori({ }) {

    const [implant, setImplant] = useState(0);
    const [data, setData] = useState([]);

    const getIdImplant = () => {
        const cookieValue = JSON.parse(Cookies.get('user-info'));
        setImplant(cookieValue.id_implant);
        return cookieValue.id_implant;
    }

    useEffect(() => {

        const fetchData = async () => {
            try {

                const id_implant = getIdImplant();

                const resp = await fetch(srvurl + "/contatori", {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ implant: id_implant })
                });
                const res = await resp.json();

                if (res.code === 0) {
                    console.log(res)
                    setData(res.data)
                } else {
                    // TODO da cambiare con alert
                    //setError(`Errore: ${error}`)
                    // <Alert msg={error}/>
                    console.error(error)
                }
            } catch (error) {
                // TODO da cambiare con alert
                //setError(`Errore: ${error}`)
                // <Alert msg={error}/>
                console.error(error)
            }
        }

        fetchData();
    }, []);

    

    return (
        <CheckCookie />
    );
}
