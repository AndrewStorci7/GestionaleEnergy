'use client'

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { refreshPage, getEnv, getServerRoute, COOKIE_NAME_USERINFO, COOKIES_SETTINGS } from "@config";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useWebSocket } from "@main/ws/use-web-socket";
import PropTypes from "prop-types"; // per ESLint
import SelectImplants from "@main/select-implant";
import { useAlert } from "@alert/alertProvider";
import { useLoader } from "@main/loader/loaderProvider";
import { sleep } from "@functions";

/**
 * Header
 * @param {*} param0 
 * @returns 
 */
export default function Header({ 
    implant, 
    username, 
    type
}) {

    const { message, ws } = useWebSocket();
    const { showLoader } = useLoader();
    const { showAlert, hideAlert } = useAlert();
    
    const _CMN_PLACE_CENTER = "place-content-center";
    
    const router = useRouter();

    const [idImplant, setIdImplant] = useState(0);
    const [date, setDate] = useState(new Date().toLocaleDateString());
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const [turn, setTurn] = useState("Turno 1");
    // conteggio balle totali che verranno conteggiate in magazzino nel turno corrente 
    const [totalbales, setTotalBales] = useState(0);
    // conteggio delle balle lavorate dal pressista
    const [totalbalesLavorate, setTotalBalesLavorate] = useState(0);
    // conteggio dei chili totali per turno
    const [totalChili, setTotalChili] = useState(0);

    /**
     * Logout handler
     * 
     * Remove the setted Cookie 'user-info'
     */
    const logout = () => {
        Cookies.remove(COOKIE_NAME_USERINFO, { path: '/', domain: getEnv('NEXT_PUBLIC_APP_DOMAIN') })
        router.push('/pages/login');
    }

    /**
     * Funzione di gestione cambio impianto
     * 
     * @param {number} id ID dell'impianto
     * @param {string} name Nome dell'impianto
     */
    const changeImplant = async (id, name) => {
        showLoader(true, "Cambio dell'impianto in corso ...");
        
        try {
            const oldCookie = JSON.parse(Cookies.get(COOKIE_NAME_USERINFO));
            oldCookie.id_implant = id;
            oldCookie.implant = name;
            Cookies.set(
                COOKIE_NAME_USERINFO, 
                JSON.stringify(oldCookie), 
                COOKIES_SETTINGS
            )
        
        } catch (err) { 
            showAlert({
                title: "Errore durante il cambio di impianto",
                message: `C'è stato un errore durante il cambio dell'impianto: ${err}`,
                type: "error",
                onConfirm: hideAlert
            })
        } finally {
            await sleep(2000);
            refreshPage(ws);
            showLoader(false);
        }
    }

    /**
     * Update the time every second
     */
    useEffect(() => {
        const fetchData = async () => {
            // try {
                const cookies = await JSON.parse(Cookies.get('user-info'));
                const url = getServerRoute("total-bale-count");
                const urlTotChili = getServerRoute("totale-chili");
                setIdImplant(cookies.id_implant);
                const implant = cookies.id_implant;
                
                const resp = await fetch(url, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ implant }),
                });
                const totChili = await fetch(urlTotChili, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ implant }),
                });
                const totChiliResp = await totChili.json();

                if (!resp.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await resp.json();

                if (data.code == 0) {
                    setTotalBales(data.message);
                    setTotalBalesLavorate(data.message2);
                    setTotalChili(totChiliResp.message.totale_chili);
                }
            // } catch (error) {
            //     // console.log(error);
            // }
        } 

        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
            setDate(new Date().toLocaleDateString());

            let _hour = parseInt(time.split(":")[0])

            if (_hour >= 6 && _hour < 14) setTurn("Turno 1");
            else if (_hour >= 14 && _hour < 22) setTurn("Turno 2");
            else if (_hour >= 22 && _hour <= 23 || _hour >= 0 && _hour < 6) setTurn("Turno 3");
            else setTurn("Turno 1");

        }, 1000);

        fetchData();
        return () => clearInterval(interval);
    }, [message]);

    return (
        <header className="on-header on-fix-index p-4 border-b border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl">
            <div className="flex justify-between gap-2">
                {/* logo */}
                <div className="col-span-2 p-[5px]">
                    <Image
                        src="/logo-oe.webp"
                        width={125}
                        height={62.5}
                        alt="Oppimitti Energy Logo"
                    />
                </div> {/* end logo */}
                <div className={`${_CMN_PLACE_CENTER}`}>
                    <div className="border w-fit py-1 px-2 rounded-xl bg-zinc-200 shadow-sm">
                        {/* {implant} */}
                        <SelectImplants showDefaultValue={false} currentValue={idImplant} onChange={changeImplant} />
                    </div>
                </div>
                <div className={`${_CMN_PLACE_CENTER} col-span-2 rounded-lg bg-gray-200 px-2`}>
                    <h3 className="text-bold">
                        Produzione sul turno
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                        <div className={`font-thin mr-[10px] ${type === 'presser' ? "!font-bold" : ""}`}>
                            Balle inserite: {totalbalesLavorate}
                        </div>
                        <div className={`font-thin ${type === 'wheelman' ? "!font-bold" : ""}`}>
                            Balle prodotte: {totalbales}
                        </div>
                        <div className="font-thin">
                            Totale chili: {totalChili}kg
                        </div>
                    </div>
                </div> {/* end total bale */}
                <div className={`${_CMN_PLACE_CENTER}`}>
                    {turn}
                </div> {/* end turns */}
                <div className={`${_CMN_PLACE_CENTER}`}>
                    {date}
                </div> {/* end date */}
                <div className={`${_CMN_PLACE_CENTER}`}>
                    {time}
                </div> {/* end time */}
                <div></div>
                <div className={`${_CMN_PLACE_CENTER}`}>
                    {username}    
                    <button
                        className="rounded-full bg-red-500 p-2 ml-2" 
                        onClick={logout}
                    >
                        <img 
                            src="/outlined/spegni2.png" 
                            alt="Logout"
                            className="w-6 h-6" 
                        />
                    </button>
                </div>
                
            </div>
        </header>
    );
}

Header.propTypes = {
    implant: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};
