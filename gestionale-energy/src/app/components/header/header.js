'use client'

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Header( {facility, username} ) {

    const [date, setDate] = useState(new Date().toLocaleDateString());
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const [turn, setFacility] = useState("Turno 1");

    /**
     * Update the time every second
     */
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
            setDate(new Date().toLocaleDateString());

            let _hour = time.getHours;
            console.log(_hour);
            switch (_hour) {
                case _hour >= 6 && _hour <= 12:
                    setFacility("Turno 1");
                    break;
                case _hour > 12 && _hour <= 18:
                    setFacility("Turno 2");
                    break;
                case _hour > 18 && _hour <= 24:
                    setFacility("Turno 3");
                    break;
                default:
                    setFacility("Turno 1");
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
                    {facility}
                </div> {/* end facility */}
                <div className="place-content-center">
                    {turn}
                </div> {/* end turns */}
                <div className="place-content-center">
                    {date}
                </div> {/* end date */}
                <div className="place-content-center">
                    {time}
                </div> {/* end time */}
                <div className="place-content-center bg-primary m-[40px] pl-[20%] rounded-md text-white">
                    {username}
                </div> {/* end user */}
            </div>
        </div>
    );
}