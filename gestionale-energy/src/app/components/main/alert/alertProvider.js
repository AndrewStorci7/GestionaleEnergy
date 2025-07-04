import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import Alert from "@main/alert/alert";

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
        message: '',
        type: 'info',
        data: null,
    });

    // Callback memoizzati per evitare re-render
    const showAlert = useCallback(({ 
        title = '', 
        message = '', 
        type = 'info', 
        data = null 
    }) => {
        console.log('Showing alert:', { title, type, hasData: !!data });
        
        setAlertState({
            visible: true,
            title,
            message,
            type,
            data
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
                />
            )}
        </AlertContext.Provider>
    );
};

// import React, { createContext, useContext, useState } from "react";
// import Alert from "@main/alert/alert";

// const AlertContext = createContext();

// export const useAlert = () => useContext(AlertContext);

// export const AlertProvider = ({ children }) => {

//     // configurazione dell'alert
//     const [alertConfig, setAlertConfig] = useState({
//         visible: false,
//         title: '',
//         message: '',
//         type: 'info',
//         onConfirm: null,
//         onCancel: null,
//         data: null,
//     }); 

//     const showAlert = ({ title, message, type = 'info', onConfirm = null, onCancel = null, data = null }) => {
//         console.log(title, data);
//         setAlertConfig({ visible: true, title, message, type, onConfirm, onCancel, data });
//     };

//     const hideAlert = () => {
//         setAlertConfig((prev) => ({ ...prev, visible: false }));
//     };

//     return (
//         <AlertContext.Provider value={{ showAlert, hideAlert }}>
//             {children}
//             {alertConfig.visible && (
//                 <Alert
//                     title={alertConfig.title} 
//                     msg={alertConfig.message}
//                     alertFor={alertConfig.type}
//                     onCancel={alertConfig.onCancel}
//                     onConfirm={alertConfig.onConfirm}
//                     data={alertConfig.data}
//                 />
//             )}
//         </AlertContext.Provider>
//     );
// }