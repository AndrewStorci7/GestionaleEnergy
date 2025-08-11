import React, { useEffect, useState } from 'react'

import { getServerRoute } from '@config';
import { useWebSocket } from "@/app/components/main/ws/use-web-socket";

export default function RenderCounters() {

    const { message } = useWebSocket();

    const [dataImplantA, setDataA] = useState(null);
    const [dataImplantB, setDataB] = useState(null);
    const [dataTotalA, setDataTotalA] = useState(null);
    const [dataTotalB, setDataTotalB] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url_contatori = getServerRoute("report-contatori");
                const url_totballe = getServerRoute("report-total-bale");

                const resp = await fetch(url_contatori, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ implant: 2 }),
                });

                const resp2 = await fetch(url_contatori, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ implant: 1 }),
                });

                const totbal = await fetch(url_totballe, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ implant: 2 }),
                });

                const totbal2 = await fetch(url_totballe, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ implant: 1 }),
                });

                const res = await resp.json();
                const res2 = await resp2.json();
                const restotbal = await totbal.json();
                const restotbal2 = await totbal2.json();

                if (res.code === 0 && res2.code === 0 && restotbal.code === 0 && restotbal2.code === 0) {
                    setDataA(res.data);  // Store data
                    setDataB(res2.data);  // Store data
                    setDataTotalA(restotbal.data);
                    setDataTotalB(restotbal2.data);
                } else {
                    setError("No data fetched");
                    // console.error(res.message);
                }
            } catch (error) {
                setError(`Error occurred while fetching the data: ${error.message}`);
                // console.error(error);
            }
        };

        fetchData();
    }, [message]);

    const renderSection = (title, items, option = "") => {
        return (
            <div>
                <h3 className="font-semibold text-md ml-[5px]">{title}</h3>
                <ul style={{ margin: '5px' }}>
                    {items.map((item, index) => (
                        <li key={index} style={{ borderWidth: 2, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'black' }}>
                            <strong>{(option === "total-bale" && !item.name) ? "Totale" : item.name}</strong>: {(option === "total-weight") ? item.totale_peso : item.totale_balle}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className="">
            <h1 className="font-bold text-3xl">Contatori</h1>
            <div className="">
                {error && <div className="error-message">{error}</div>}
                <div className="grid grid-cols-8 bg-red-200">
                    <h2 className="font-bold text-2xl">Impianto A</h2>
                    <div className="col-span-8">
                        {dataTotalB && (
                            <>
                                {renderSection('Balle Totali COMPLETATE Impianto A', dataTotalB, "total-bale")}
                                {/* {renderSection('Peso balle totali Impianto A', dataTotalB, "total-weight")} */}
                            </>
                        )}
                    </div>
                    {dataImplantB && (
                        <>
                            {renderSection('Cond. Pressista', dataImplantB.cond_pres[0])}
                            {renderSection('Codice Plastica', dataImplantB.cont_plastic[0])}
                            {renderSection('Utiliz. REI', dataImplantB.utiliz_rei[0])}
                            {renderSection('Balla Selezionata', dataImplantB.sel_bale[0])}
                            {renderSection('Cond. Carrellista', dataImplantB.cond_wheel[0])}
                            {renderSection('Motivazioni', dataImplantB.motivation[0])}
                            {renderSection('Magazzino Di Dest.', dataImplantB.sel_warehouse[0])}
                            {renderSection('Codice Plastica Completata', dataImplantB.cont_plastic_comp[0])}
                        </>
                    )}
                </div>

                <div className="grid grid-cols-8 bg-green-200">
                    <h2 className="font-bold text-2xl">Impianto B</h2>
                    <div className="col-span-8">
                        {dataTotalA && (
                            <>
                                {renderSection('Balle Totali Impianto B', dataTotalA, "total-bale")}
                                {/* {renderSection('Peso balle totali Impianto B', dataTotalA, "total-weight")} */}
                            </>
                        )}
                    </div>
                    {dataImplantA && (
                        <>
                            {renderSection('Cond. Pressista', dataImplantA.cond_pres[0])}
                            {renderSection('Codice Plastica', dataImplantA.cont_plastic[0])}
                            {renderSection('Utiliz. REI', dataImplantA.utiliz_rei[0])}
                            {renderSection('Balla Selezionata', dataImplantA.sel_bale[0])}
                            {renderSection('Cond. Carrellista', dataImplantA.cond_wheel[0])}
                            {renderSection('Motivazioni', dataImplantA.motivation[0])}
                            {renderSection('Magazzino di Dest.', dataImplantA.sel_warehouse[0])}
                            {renderSection('Codice Plastica Completata', dataImplantA.cont_plastic_comp[0])}
                        </>
                    )}
                    {!(dataTotalA && dataTotalB && dataImplantA && dataImplantB) && (
                        <p>Loading data...</p>
                    )}
                </div>
            </div>
        </div>
    )
}
