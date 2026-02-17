import React from "react";

const Loader = ({
    message
}) => {
    return (
        <div 
        className="loader-container flex center" 
        role="status" 
        aria-live="polite">
            <div className="spinner" />
            <div className="bg-white p-[5px] rounded-md">
                <p>{message}</p>
            </div>
        </div>
    )
}

export default Loader;