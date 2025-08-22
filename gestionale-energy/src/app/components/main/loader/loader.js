import React from "react";

const Loader = () => {
    return (
        <div className="loader-container" role="status" aria-live="polite">
            <div className="spinner" />
        </div>
    )
}

export default Loader;