'use client'

import Image from "next/image";
import { useState, useEffect } from "react";
import { getEnv, getBgColor, getServerRoute } from "@/app/config";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useWebSocket } from "@@/components/main/ws/use-web-socket";

/**
 * 
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
                const url = await getServerRoute("total-bale-count");
                const implant = cookies.id_implant;
                
                const resp = await fetch(url, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ implant }),
                });

                if (!resp.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await resp.json();

                if (data.code == 0) {
                    setTotalBales(data.message);
                    setTotalBalesLavorate(data.message2);
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

        }, 1000);

        fetchData();
        return () => clearInterval(interval);
    }, [message]);

    return (
        <header className="on-header on-fix-index">
            <div className="grid grid-cols-9 gap-4">
                {/* logo */}
                <div className="col-span-2 p-[5px]">
                    <Image
                        src="/logo-oe.webp"
                        width={200}
                        height={100}
                        alt="Oppimitti Energy Logo"
                    />
                </div> {/* end logo */}
                <div className={`${_CMN_PLACE_CENTER}`}>
                    {implant}
                </div> {/* end implant */}
                <div className={`${_CMN_PLACE_CENTER} col-span-2`}>
                    Balle totali a mag.: {totalbales}<br/>
                    Balle totali lavorate: {totalbalesLavorate}
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
                <div className="realtive">
                    <div className={`${_CMN_PLACE_CENTER} ${getBgColor(type, "header")} w-full px-[10px] rounded-t-md text-white`}>
                        {username}
                    </div>
                    <div className={`${_CMN_PLACE_CENTER} ${getBgColor(type)} w-full px-[10px]`}>
                        <span className="w-fit">{name} {surname}</span>
                    </div>
                    <div className={`flex justify-end ${getBgColor(type)} w-full p-[10px] rounded-b-md`}>
                        <button
                        className="rounded-md bg-gray-300 px-[5px]"
                        onClick={logout} >
                            Logout
                        </button>
                    </div>

                </div> {/* end user */}
            </div>
        </header>
    );
}