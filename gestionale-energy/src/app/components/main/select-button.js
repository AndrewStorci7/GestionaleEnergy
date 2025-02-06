import React from 'react';
import { FaCheck, FaRegSquare } from 'react-icons/fa'; // FontAwesome icons

/**
 * Check button for selecting a bale
 * 
 * @param {boolean} isSelected Indicates if the current bale is selected
 * @param {function} handleClick Function to handle click event and update selection
 */
export default function CheckButton({ isSelected = false, handleClick }) {
    const handleToggle = () => {
        handleClick(); // Toggle selection from the parent component
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
                {isSelected ? <FaCheck className="bg-green-300" /> : <FaRegSquare />} {/* Icon changes based on state */}
            </button>
        </div>
    );
}
