import React, { useMemo } from "react";
import { FaCheck } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import { MdWork } from "react-icons/md";
import { RiErrorWarningFill } from "react-icons/ri";
import { TbCircleLetterRFilled } from "react-icons/tb";
import { FaInfoCircle } from "react-icons/fa";

/**
 * 
 * @param {string} type 
 * @returns 
 */
export default function Icon({ 
    className,
    type = "",
    ...props
}) {

    const icon = useMemo(() => {

        switch (type) {
            case 'completed':
                return <FaCheck className="text-checked text-2xl" />
            case 'warning':
                return <RiErrorWarningFill className="text-error text-2xl" />
            case 'working':
                return <IoIosWarning className="text-waiting text-2xl" />
            case 'info': 
                return <FaInfoCircle className={`text-info text-2xl ${className ?? className}`} />
            case "rei":
                return <TbCircleLetterRFilled className="text-black text-2xl" />
            default:
                return <IoIosWarning className="text-waiting text-2xl" />
        }
    }, [type]);
    
    return (
        <div className="mx-2 grid place-content-center">
            {icon}
        </div>
    );
}