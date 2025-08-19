import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import Alert from "@main/alert/alert";

import PropTypes from 'prop-types'; // per ESLint

const AlertContext = createContext();

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};

export const AlertProvider = ({ children }) => {
    // Stato semplificato per evitare re-render inutili
    const [alertState, setAlertState] = useState({
        visible: false,
        title: '',
        message: null,
        type: 'info',
        data: null,
        onConfirm: null
    });

    // Callback memoizzati per evitare re-render
    const showAlert = useCallback(({ 
        title = '', 
        message = '', 
        type = 'info', 
        data = null,
        onConfirm = null
    }) => {
        // console.log('Showing alert:', { title, type, hasData: !!data });

        setAlertState({
            visible: true,
            title,
            message,
            type,
            data,
            onConfirm
        });
    }, []);

    const hideAlert = useCallback(() => {
        setAlertState(prev => ({
            ...prev,
            visible: false
        }));
    }, []);

    // Valore del context memoizzato
    const contextValue = useMemo(() => ({
        showAlert,
        hideAlert
    }), [showAlert, hideAlert]);

    return (
        <AlertContext.Provider value={contextValue}>
            {children}
            {alertState.visible && (
                <Alert
                    title={alertState.title}
                    msg={alertState.message}
                    alertFor={alertState.type}
                    data={alertState.data}
                    onHide={hideAlert}
                    onConfirm={alertState.onConfirm}
                />
            )}
        </AlertContext.Provider>
    );
};

AlertProvider.propTypes = {
    children: PropTypes.node.isRequired
};