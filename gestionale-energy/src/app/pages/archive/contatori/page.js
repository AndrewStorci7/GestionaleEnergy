'use client';

import React, { useState, useEffect, useTransition } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { getSrvUrl } from '@@/config';
import Cookies from 'js-cookie';
import CheckCookie from "@/app/components/main/check-cookie";

import RenderCounters from "./renderCounter/render-counters";

import { WebSocketProvider, useWebSocket } from "@/app/components/main/ws/use-web-socket";

const srvurl = getSrvUrl();

const cookie = JSON.parse(Cookies.get('user-info'));

export default function Contatori() {

    const [something, setSomething] = useState(null);
    const { ws, message } = useWebSocket();

    const [user, setUser] = useState(cookie.username);
    const [name, setName] = useState(cookie.name);
    const [surname, setSurname] = useState(cookie.surname);

    const [implant, setImplant] = useState(0);
    const [dataImplantA, setDataA] = useState(null);
    const [dataImplantB, setDataB] = useState(null);
    const [dataTotalA, setDataTotalA] = useState(null);
    const [dataTotalB, setDataTotalB] = useState(null);
    const [error, setError] = useState(null);

    // const getIdImplant = () => {
    //     const cookieValue = JSON.parse(Cookies.get('user-info'));
    //     setImplant(cookieValue.id_implant);
    //     // setUser(cookieValue.username);
    //     // setName(cookieValue.name);
    //     // setSurname(cookieValue.surname);
    //     return cookieValue.id_implant;
    // };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const id_implant = getIdImplant();
                const resp = await fetch(srvurl + "/contatori", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ implant: 1 }),
                });

                const resp2 = await fetch(srvurl + "/contatori", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ implant: 2 }),
                });

                const totbal = await fetch(srvurl + "/tot-balle", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ implant: 1 }),
                });

                const totbal2 = await fetch(srvurl + "/tot-balle", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ implant: 2 }),
                });

                const res = await resp.json();
                const res2 = await resp2.json();
                const restotbal = await totbal.json();
                const restotbal2 =await totbal2.json();

                if (res.code === 0 && res2.code === 0 && restotbal.code === 0 && restotbal2.code === 0) {
                    console.log(res.data)
                    console.log(res2.data)
                    console.log(restotbal.data)
                    console.log(restotbal2.data)
                    setDataA(res.data);  // Store data
                    setDataB(res2.data);  // Store data
                    setDataTotalA(restotbal.data);
                    setDataTotalB(restotbal2.data);
                } else {
                    setError("No data fetched");
                    console.error(res.message);
                }
            } catch (error) {
                setError("Error occurred while fetching the data");
                console.error(error);
            }
        };

        fetchData();
    }, [something]);

    const renderSection = (title, items, option = "") => {
        return (
            <div>
                <h3 className="font-semibold text-md">{title}</h3>
                <ul>
                    {items.map((item, index) => (
                        <li key={index}>
                            <strong>{(option === "") ? item.name : ""}</strong>: {(option === "total-weight") ? item.totale_peso : item.totale_balle}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <WebSocketProvider user={{ user, name, surname }}>
            <CheckCookie />
            <RenderCounters handler={() => setSomething} />
            <div className="">
                <h1 className="font-bold text-3xl">Contatori</h1>
                <div className="">
                    {error && <div className="error-message">{error}</div>}
                    <div className="grid grid-cols-7 bg-red-200">
                        <h2 className="font-bold text-2xl">Impianto A</h2>
                        <div className="col-span-7">
                            {dataTotalB && (
                                <>
                                    {renderSection('Balle Totali Impianto A', dataTotalB, "total-bale")}
                                    {renderSection('Peso balle totali Impianto A', dataTotalB, "total-weight")}
                                </>
                            )}
                        </div>
                        {dataImplantB && (
                            <>
                                {renderSection('Motivazioni', dataImplantB.motivation[0])}
                                {renderSection('Selected Warehouse', dataImplantB.sel_warehouse[0])}
                                {renderSection('Balla Selezionata', dataImplantB.sel_bale[0])}
                                {renderSection('Condition Wheel', dataImplantB.cond_wheel[0])}
                                {renderSection('Condition Presser', dataImplantB.cond_pres[0])}
                                {renderSection('Utilization by Rei', dataImplantB.utiliz_rei[0])}
                                {renderSection('Plastic Code', dataImplantB.cont_plastic[0])}
                            </>
                        )}
                    </div>

                    <div className="grid grid-cols-7 bg-green-200">
                        <h2 className="font-bold text-2xl">Impianto B</h2>
                        <div className="col-span-7">
                            {dataTotalA && (
                                <>
                                    {renderSection('Balle Totali Impianto B', dataTotalA, "total-bale")}
                                    {renderSection('Peso balle totali Impianto B', dataTotalA, "total-weight")}
                                </>
                            )}
                        </div>
                        {dataImplantA && (
                            <>
                                {renderSection('Motivazioni', dataImplantA.motivation[0])}
                                {renderSection('Selected Warehouse', dataImplantA.sel_warehouse[0])}
                                {renderSection('Balla Selezionata', dataImplantA.sel_bale[0])}
                                {renderSection('Condition Wheel', dataImplantA.cond_wheel[0])}
                                {renderSection('Condition Presser', dataImplantA.cond_pres[0])}
                                {renderSection('Utilization by Rei', dataImplantA.utiliz_rei[0])}
                                {renderSection('Plastic Code', dataImplantA.cont_plastic[0])}
                            </>
                        )}
                        {!(dataTotalA && dataTotalB && dataImplantA && dataImplantB) && (
                            <p>Loading data...</p>
                        )}
                    </div>
                </div>
            </div>
        </WebSocketProvider>
    );
}
