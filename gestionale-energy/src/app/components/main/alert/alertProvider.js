import React, { createContext, useContext, useState } from "react";
import Alert from "@main/alert/alert";

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {

    // configurazione dell'alert
    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        title: '',
        message: '',
        type: 'info',
        onConfirm: null,
        onCancel: null,
        data: null,
    }); 

    const showAlert = ({ title, message, type = 'info', onConfirm = null, onCancel = null, data = null }) => {
        setAlertConfig({ visible: true, title, message, type, onConfirm, onCancel, data });
    };

    const hideAlert = () => {
        setAlertConfig((prev) => ({ ...prev, visible: false }));
    };

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert }}>
            {children}
            {alertConfig.visible && (
                <Alert
                    title={alertConfig.title} 
                    msg={alertConfig.message}
                    alertFor={alertConfig.type}
                    onCancel={alertConfig.onCancel}
                    onConfirm={alertConfig.onConfirm}
                    data={alertConfig.data}
                />
            )}
        </AlertContext.Provider>
    );
}