'use client'

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Header({ implant, username, type, name, surname }) {

    const _CMN_PLACE_CENTER = "place-content-center";

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
                return "bg-secondary"
            default:
                return "bg-primary"
        }
    }

    const logout = () =>  {
        // TODO
        // logout
        console.log("Logout")
    }

    /**
     * Update the time every second
     */
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
            setDate(new Date().toLocaleDateString());

            let _hour = time.getHours;
            switch (_hour) {
                case _hour >= 6 && _hour <= 12:
                    setTurn("Turno 1");
                    break;
                case _hour > 12 && _hour <= 18:
                    setTurn("Turno 2");
                    break;
                case _hour > 18 && _hour <= 24:
                    setTurn("Turno 3");
                    break;
                default:
                    setTurn("Turno 1");
                    break;
            }
        }, 1000);

        return () => clearInterval(interval);
    });

    return (
        <div className="w-full bg-white text-thirdary font-bold text-2xl rounded-[5px]">
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
        </div>
    );
}