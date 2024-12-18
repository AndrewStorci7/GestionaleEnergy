'use client'

import Image from "next/image";
import { useState, useEffect } from "react";
import { getEnv } from "@/app/config";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Header({ implant, username, type, name, surname }) {

    const _CMN_PLACE_CENTER = "place-content-center";

    const router = useRouter();

    const [date, setDate] = useState(new Date().toLocaleDateString());
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const [turn, setTurn] = useState("Turno 1");

    /**
     * Get Background Color
     * 
     * @param {string} type 
     * @returns 
     */
    const getBgColor = (type) => {
        switch (type) {
            case 'admin':
                return "bg-primary"
            case 'presser':
                return "bg-primary"
            case 'wheelman':
                return "bg-secondary"
            case 'both':
                return "bg-thirdary_1"
            default:
                return "bg-primary"
        }
    }

    /**
     * Logout handler
     * 
     * Remove the setted Cookie 'user-info'
     */
    const logout = () => {
        Cookies.remove('user-info', { path: '/', domain: getEnv('NEXT_PUBLIC_APP_DOMAIN') })
        router.push('/pages/login')
    }

    /**
     * Update the time every second
     */
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
            setDate(new Date().toLocaleDateString());

            let _hour = parseInt(time.split(":")[0])
            // console.log(_hour)
            if (_hour >= 6 && _hour < 14)
                setTurn("Turno 1");
            else if (_hour >= 14 && _hour < 22)
                setTurn("Turno 2");
            else if (_hour >= 22 && _hour < 6)
                setTurn("Turno 3");
            else
                setTurn("Turno ciao");

        }, 1000);

        return () => clearInterval(interval);
    });

    return (
        <header className="w-full bg-white text-thirdary font-bold text-2xl rounded-[5px]">
            <div className="grid grid-cols-7 gap-4">
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
                    <div className={`${_CMN_PLACE_CENTER} ${getBgColor(type)} w-full px-[10px] rounded-t-md text-white`}>
                        {username}
                    </div>
                    <div className={`${_CMN_PLACE_CENTER} ${getBgColor(type)}_2 w-full px-[10px]`}>
                        <span className="w-fit">{name} {surname}</span>
                    </div>
                    <div className={`flex justify-end ${getBgColor(type)}_2 w-full p-[10px] rounded-b-md`}>
                        <button
                        className="rounded-md bg-gray-300 px-[5px]"
                        onClick={logout}
                        >
                            Logout
                        </button>
                    </div>

                </div> {/* end user */}
            </div>
        </header>
    );
}