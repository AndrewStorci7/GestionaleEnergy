import React, { useEffect, useState } from 'react';
import { FaCheck, FaRegSquare } from 'react-icons/fa'; // FontAwesome icons

/**
 * Check button per modifica ed elimina balla pressista
 * 
 * @prop {function} handleClick Funzione che gestisce lo stato del click 
 */
export default function CheckButton({ handleClick }) {
    const [isChecked, setIsChecked] = useState(false);

    const handleToggle = () => {
        setIsChecked(!isChecked);
        handleClick(isChecked)
    };

    // useEffect(() => {
    //     handleClick(isChecked)
    // }, [isChecked])

    return (
        <div className="flex justify-center">
            <button
                className="text-md"
                onClick={handleToggle}
                style={{
                    fontSize: '15px',
                    cursor: 'pointer',
                }}
            >
            {isChecked ? <FaCheck className="bg-green-300" /> : <FaRegSquare />} {/* Icon changes based on state */}
            </button>
        </div>
    );
}