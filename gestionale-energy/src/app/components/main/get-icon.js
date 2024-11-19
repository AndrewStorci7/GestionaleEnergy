import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import { MdWork } from "react-icons/md";

export default function Icon( {type} ) {

    const _icon = <></>;

    useEffect(() => {
        switch (type) {
            case 'completed': {
                _icon = <FaCheck className="grid text-checked text-2xl" />
            }
            case 'warning': {
                _icon = <IoIosWarning className="grid text-error text-2xl" />
            }
            case 'working': {
                _icon = <MdWork className="absolute text-waiting text-2xl" />
            }
            default: {
                _icon = <MdWork className="absolute text-waiting text-2xl" />
            }
        }
    }, []);

    return (
        <div className="w-full relative">
            {_icon}
        </div>
    );
}