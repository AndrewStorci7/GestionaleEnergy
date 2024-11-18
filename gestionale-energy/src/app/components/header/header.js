'use client'

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Header( {implant, username} ) {

    const [date, setDate] = useState(new Date().toLocaleDateString());
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const [turn, setTurn] = useState("Turno 1");

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
        <div className="w-full bg-white text-primary font-bold text-2xl rounded-[5px]">
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
                <div className="place-content-center">
                    {implant}
                </div> {/* end implant */}
                <div className="place-content-center">
                    {turn}
                </div> {/* end turns */}
                <div className="place-content-center">
                    {date}
                </div> {/* end date */}
                <div className="place-content-center">
                    {time}
                </div> {/* end time */}
                <div className="place-content-center bg-primary m-[40px] pl-[5px] rounded-md text-white">
                    {username}
                </div> {/* end user */}
            </div>
        </div>
    );
}