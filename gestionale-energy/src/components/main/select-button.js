import React, { useState } from 'react';
import { FaCheck, FaRegSquare } from 'react-icons/fa'; // FontAwesome icons

export default function CheckButton() {
    const [isChecked, setIsChecked] = useState(false);

    const handleToggle = () => {
        setIsChecked(!isChecked);
    };

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