import React, { useMemo } from "react";
import { FaCheck } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import { MdWork } from "react-icons/md";
import { RiErrorWarningFill } from "react-icons/ri";
// Info 1
// import { MdInfoOutline } from "react-icons/md";
// Info 2
import { FaInfoCircle } from "react-icons/fa";

export default function Icon({ type = "" }) {

    const icon = useMemo(() => {

        switch (type) {
            case 'completed':
                return <FaCheck className="text-checked text-2xl" />
            case 'warning':
                return <RiErrorWarningFill className="text-error text-2xl" />
            case 'working':
                return <IoIosWarning className="text-waiting text-2xl" />
            case 'info': 
                return <FaInfoCircle className="text-info text-2xl" />
            default:
                return <IoIosWarning className="text-waiting text-2xl" />
        }
    }, [type]);
    
    return (
        <div className="w-full grid place-content-center">
            {icon}
        </div>
    );
}