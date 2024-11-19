import React, { useMemo } from "react";
import { FaCheck } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import { MdWork } from "react-icons/md";

export default function Icon({ type = "" }) {

    const icon = useMemo(() => {

        switch (type) {
            case 'completed':
                return <FaCheck className="text-checked text-2xl" />
            case 'warning':
                return <IoIosWarning className="text-error text-2xl" />
            case 'working':
                return <MdWork className="text-waiting text-2xl" />
            default:
                return <MdWork className="text-waiting text-2xl" />
        }
    }, [type]);
    
    return (
        <div className="w-full grid place-content-center">
            {icon}
        </div>
    );
}