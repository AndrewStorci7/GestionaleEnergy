'use client'

import Image from "next/image";
import { useState, useEffect } from "react";
import { getEnv, getServerRoute, fetchReportData } from "@/app/config";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useWebSocket } from "@@/components/main/ws/use-web-socket";
import { handleDownload } from "@admin/export-report";

/**
 * Header
 * @param {*} param0 
 * @returns 
 */
export default function Header({ 
    implant, 
    username, 
    type, 
    name, 
    surname 
}) {

    const { ws, message } = useWebSocket();
    
    const _CMN_PLACE_CENTER = "place-content-center";
    
    const router = useRouter();

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
        Cookies.remove('user-info', { path: '/', domain: getEnv('NEXT_PUBLIC_APP_DOMAIN') })
        router.push('/pages/login');
    }

    /**
     * Update the time every second
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const cookies = await JSON.parse(Cookies.get('user-info'));
                const url = getServerRoute("total-bale-count");
                const urlTotChili = getServerRoute("totale-chili");
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
            } catch (error) {
                console.log(error);
            }
        } 

        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
            setDate(new Date().toLocaleDateString());

            let _hour = parseInt(time.split(":")[0])
            // console.log(_hour)
            if (_hour >= 6 && _hour < 14)
                setTurn("Turno 1");
            else if (_hour >= 14 && _hour < 22)
                setTurn("Turno 2");
            else if (_hour >= 22 && _hour <= 23 || _hour >= 0 && _hour < 6)
                setTurn("Turno 3");
            else
                setTurn("Turno 1");

            // if (_hour === 6) {
            //     handleDownload(fetchReportData, 'impianto-a');
            //     handleDownload(fetchReportData, 'impianto-b');
            // }

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
                        {implant}
                    </div>
                </div>
                <div className={`${_CMN_PLACE_CENTER} col-span-2 rounded-lg bg-gray-200 px-2`}>
                    <h3 className="text-bold">
                        Produzione sul turno
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                        {/* <div className={`font-thin mr-[10px] ${type === 'presser' ? "border w-fit py-1 px-2 rounded-xl bg-red-200 shadow-sm text-neutral-600" : ""}`}>
                            Balle totali lavorate: {totalbalesLavorate}
                        </div>
                        <div className={`font-thin ${type === 'wheelman' ? "border w-fit py-1 px-2 rounded-xl bg-green-200 shadow-sm" : "font-thin"}`}>
                            Balle totali a mag.: {totalbales}
                        </div> */}
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