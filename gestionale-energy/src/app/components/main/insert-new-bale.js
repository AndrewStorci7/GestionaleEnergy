'use-client';
import { getServerRoute, refreshPage, isWebSocketConnected } from '@config';
import React, { useState } from 'react';
import SelectInput from '@main/search/select';
import Cookies from 'js-cookie';
import { useWebSocket } from "@@/components/main/ws/use-web-socket";

import PropTypes from 'prop-types'; // per ESLint

export default function InsertNewBale({ 
    type, 
    mod,
    primary, 
    confirmHandle,
    style = "",
}) {
    const { ws } = useWebSocket();

    // Stati condivisi
    const [note, setNote] = useState("");

    // Stati Pressista
    const [plastic, setPlastic] = useState("");
    const [plastic2, setPlastic2] = useState("");
    const [rei, setRei] = useState("");
    const [cdbp, setCdbp] = useState("");
    const [selectedBale, setSelectedBale] = useState("");
    const [isPlasticValid, setPlasticValid] = useState(false);

    // Stati Carrellista
    const [cdbc, setCdbc] = useState("");
    const [reason, setReason] = useState("");
    const [weight, setWeight] = useState(0);
    const [destWh, setDestWh] = useState("");

    /**
     * Gestisce il click per inserire una nuova balla
     */
    const handleClick = async () => {
        try {
            if (!isWebSocketConnected(ws)) {
                console.error("WebSocket is not connected");
                return;
            }

            const cookie = JSON.parse(Cookies.get('user-info'));
            if (!plastic) {
                console.error("Plastica non selezionata"); 
                return;
            }

            const url = getServerRoute("add-bale");
            const body = {
                id_presser: cookie.id_user,
                id_plastic: plastic,
                id_rei: rei || 1,
                id_cpb: cdbp || 1,
                id_sb: selectedBale || 1,
                note
            };

            const resp = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: { implant: cookie.id_implant, body } })
            });

            if (resp.ok) {
                confirmHandle();
                refreshPage(ws);
            } else {
                console.log("Errore durante l'aggiunta della balla");
            }
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Renderizza la tabella per il Pressista
     */
    const renderPresserRow = () => (
        <tr className='bg-zinc-200 h-[47px]'>
            {primary && (<><td className={style + " !p-2"} /><td /><td className={style + " !p-2"} /></>)}
            <td className={style + " !p-2"}>
                {mod && <SelectInput searchFor="plastic" value={plastic} onChange={(e) => {
                    const code = e.target.selectedOptions[0].getAttribute("data-code");
                    console.log(typeof code);
                    setPlastic(e.target.value);
                    setPlastic2(code);
                    setPlasticValid(!!code);
                    // setChangeWarehouseProv(code.includes('MDR'));
                }} fixedW />}
            </td>
            <td className={style + " !p-2"}>{mod && plastic2}</td>
            <td className={style + " !p-2"}>{mod && <SelectInput searchFor="rei" value={rei} onChange={(e) => setRei(e.target.value)} fixedW />}</td>
            <td className={style + " !p-2"}>{mod && <SelectInput searchFor="cdbp" value={cdbp} onChange={(e) => setCdbp(e.target.value)} fixedW />}</td>
            <td className={style + " !p-2"}>{mod && <SelectInput searchFor="selected-b" value={selectedBale} onChange={(e) => setSelectedBale(e.target.value)} fixedW />}</td>
            <td className={style + " !p-2"}>{mod && <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Inserisci note" />}</td>
            {primary && (
                <td className={style + " !p-2"}>
                    <button className={`border-b text-white font-bold px-[6px] py-[3px] rounded-xl bg-blue-500 ${!isPlasticValid && 'disabled:opacity-45 cursor-no-drop'}`} onClick={handleClick} disabled={!isPlasticValid}>OK</button>
                </td>
            )}
            <td className={style + " !p-2"}></td>
            <td className={style + " !p-2"}></td>
        </tr>
    );

    /**
     * Renderizza la tabella per il Carrellista
     */
    const renderWheelmanRow = () => (
        <tr className='bg-zinc-200 h-[47px]'>
            <td className={style + " !p-2"}>{mod && <SelectInput searchFor="cdbc" value={cdbc} onChange={(e) => setCdbc(e.target.value)} fixedW />}</td>
            <td className={style + " !p-2"}>{mod && <SelectInput searchFor="reason" value={reason} onChange={(e) => setReason(e.target.value)} fixedW />}</td>
            <td className={style + " !p-2"}>{mod && <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Inserisci peso" />}</td>
            <td className={style + " !p-2"}>{mod && <SelectInput searchFor="dest-wh" value={destWh} onChange={(e) => setDestWh(e.target.value)} fixedW />}</td>
            <td className={style + " !p-2"}>{mod && <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Inserisci note" />}</td>
            <td className={style + " !p-2"}></td>
            <td className={style + " !p-2"}></td>
            <td className={style + " !p-2"}></td>
        </tr>
    );

    return type === "presser" ? renderPresserRow() : renderWheelmanRow();
}

InsertNewBale.propTypes = {
    type: PropTypes.string.isRequired,
    mod: PropTypes.bool.isRequired,
    primary: PropTypes.bool.isRequired,
    confirmHandle: PropTypes.func.isRequired,
    style: PropTypes.string
};