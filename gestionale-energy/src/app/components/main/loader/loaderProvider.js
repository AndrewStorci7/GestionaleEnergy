import React, { createContext, useContext, useState } from "react";

import PropTypes from 'prop-types'; // per ESLint
import Loader from "./loader";

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {

    const [visible, setVisibility] = useState(false)

    const showLoader = (val) => setVisibility(val)

    return (
        <LoaderContext.Provider value={{ showLoader }}>
            {children}
            {visible && (
                <Loader />
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