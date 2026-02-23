import React, { createContext, useContext, useState } from "react";

import PropTypes from 'prop-types'; // per ESLint
import Loader from "@main/loader/loader";

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {

    const [visible, setVisibility] = useState(false)
    const [message, setMessage] = useState("");

    const showLoader = (val, msg = "") => {
        setVisibility(val)
        setMessage(msg)
    }

    return (
        <LoaderContext.Provider value={{ showLoader }}>
            {children}
            {visible && (
                <Loader message={message} />
            )}
        </LoaderContext.Provider>
    )
}

LoaderProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export function useLoader() {
    const context = useContext(LoaderContext);
    if (!context) {
        throw new Error("useLoader deve essere usato dentro a LoaderProvider");
    }
    return context;
}