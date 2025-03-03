'use client';

import React, { useState, useEffect } from "react";

import { saveAs } from "file-saver";
import { getServerRoute, getSrvUrl } from '@@/config';
import Cookies from 'js-cookie';
import CheckCookie from "@/app/components/main/check-cookie";

import RenderCounters from "./renderCounter/render-counters";

import { WebSocketProvider, useWebSocket } from "@/app/components/main/ws/use-web-socket";
import { refreshPage, getBgColor } from '@/app/config';

const srvurl = getSrvUrl();

const cookie = JSON.parse(Cookies.get('user-info'));



export default function Contatori() {
    
    const [something, setSomething] = useState(false);
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

    // Use useEffect to automatically call handleAddChange whenever the 'something' state changes
    useEffect(() => {

         
        
        const fetchData = async () => {
            try {
                const url2 = getServerRoute("report-balletotali");
                const url = getServerRoute("report-live");

                const resp = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ implant: 1 }),
                });

                const resp2 = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ implant: 2 }),
                });

                const totbal = await fetch(url2, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ implant: 1 }),
                });

                const totbal2 = await fetch(url2, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ implant: 2 }),
                });

                const res = await resp.json();
                const res2 = await resp2.json();
                const restotbal = await totbal.json();
                const restotbal2 = await totbal2.json();

                if (res.code === 0 && res2.code === 0 && restotbal.code === 0 && restotbal2.code === 0) {
                    setDataA(res.data);
                    setDataB(res2.data);
                    setDataTotalA(restotbal.data);
                    setDataTotalB(restotbal2.data);
                } else {
                    setError("No data fetched");
                }
            } catch (error) {
                setError("Error occurred while fetching the data");
            }
        };

        fetchData();
    }, [something, message]); 

    useEffect(() => {
        if (ws && dataTotalA && dataTotalB && dataImplantA && dataImplantB) {
            handleAddChange(ws, setSomething); 
        }
        console.log(ws);
    }, [ws, dataTotalA, dataTotalB, dataImplantA, dataImplantB]);

    
    const handleAddChange = async (ws, setSomething) => {
        if (ws) {
            refreshPage(ws); 
        }
    
        if (setSomething) {
            setSomething(prev => !prev); // Toggling the state to trigger a re-fetch or UI
        }
    }

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
            <div>
                <h1 className="font-bold text-3xl">Contatori</h1>
                <div>
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
