'use client';
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Draggable from "react-draggable";
import { IoClose } from "react-icons/io5";
import Icon from "@main/get-icon";

import UpdateValuesBale from "@main/update-bale";
import { useWebSocket } from "@main/ws/use-web-socket";
import { useAlert } from "@main/alert/alertProvider";
import { handleDelete, handleStampa } from "@main/fetch";

import { refreshPage } from "@config";

import PropTypes from 'prop-types'; // per ESLint


/**
* @author Daniele Zeraschi from Oppimittinetworking
* 
* @param {string}    title      Titolo dell'alert
* @param {string}    msg        Messaggio dell'alert
* @param {string}    alertFor   Tipo di alert
* @param {object}    data       Dati della balla
* @param {Function}  onHide     Callback per chiudere l'alert
**/
export default function Alert({
    title = null,
    msg = null, 
    alertFor = null,
    data = null,
    onHide
}) {
    const nodeRef = useRef(null);
    const { showAlert, hideAlert } = useAlert(); 
    const { ws } = useWebSocket();
    
    const [internalState, setInternalState] = useState({
        alertType: "",
        message: "",
        isProcessing: false
    });

    // Memoizza il tipo di alert sanitizzato
    const sanitizedAlertType = useMemo(() => {
        if (!alertFor) return "error";
        return alertFor.startsWith('update') ? 'update' : alertFor;
    }, [alertFor]);

    // Callback per chiudere l'alert ottimizzato
    const closeAlert = useCallback(() => {
        try {
            if (data?.setIdBale) {
                data.setIdBale(null);
            }
            // Non fare refresh automatico - lascia che sia il componente parent a decidere
            refreshPage(ws);
            onHide?.() || hideAlert();
        } catch (error) {
            console.error('Error closing alert:', error);
            setInternalState(prev => ({
                ...prev,
                alertType: "error",
                message: error.message || error
            }));
        }
    }, [data, onHide, hideAlert]);

    // Callback per gestire l'eliminazione
    const handleConfirm = useCallback(async () => {
        if (internalState.isProcessing) return;
        
        try {
            setInternalState(prev => ({ ...prev, isProcessing: true }));
            
            await handleDelete(data.idUnique, (msg, scope) => {
                setInternalState(prev => ({
                    ...prev,
                    alertType: scope,
                    message: msg
                }));
            });
            
            refreshPage(ws);
            closeAlert();
        } catch (error) {
            console.error('Error in handleConfirm:', error);
            setInternalState(prev => ({
                ...prev,
                alertType: "error",
                message: error.message || error,
                isProcessing: false
            }));
        }
    }, [data?.idBale, internalState.isProcessing, ws, closeAlert]);

    // Callback per gestire la stampa
    const handlePrintConfirm = useCallback(async () => {
        if (internalState.isProcessing) return;
        
        try {
            setInternalState(prev => ({ ...prev, isProcessing: true }));
            await handleStampa(data, closeAlert, showAlert);
        } catch (error) {
            console.error('Error in handlePrintConfirm:', error);
            setInternalState(prev => ({
                ...prev,
                alertType: "error",
                message: error.message || error,
                isProcessing: false
            }));
        }
    }, [data, internalState.isProcessing, closeAlert, showAlert]);

    // Inizializza lo stato interno solo al mount
    useEffect(() => {
        setInternalState(prev => ({
            ...prev,
            alertType: sanitizedAlertType,
            message: msg || ""
        }));
    }, [sanitizedAlertType, msg]);

    // Memoizza il contenuto dell'alert per evitare re-render
    const alertContent = useMemo(() => {
        const currentAlertType = internalState.alertType || sanitizedAlertType;
        const currentMessage = internalState.message || msg || "";
        
        switch(currentAlertType) {
            case "error": {
                return (
                    <div className="alert-box on-border error">
                        <h1 className="title-alert" style={{ color: 'red' }}>
                            {title || 'Errore'}
                        </h1>
                        <p>Errore: {currentMessage}</p>
                        <button
                            onClick={closeAlert}
                            className="alert-button error-button"
                            disabled={internalState.isProcessing}
                        >
                            Chiudi
                        </button>
                    </div>
                );
            }
            case "note": {
                return (
                    <div className="alert-box on-border note">
                        <h1 className="title-alert text-left" style={{ color: 'black' }}>
                            {title || 'Nota scritta dall\'utente'}
                        </h1>
                        <br />
                        <p className="text-left">{currentMessage}</p>
                        <br />
                        <button
                            onClick={closeAlert}
                            className="alert-button note-button"
                            disabled={internalState.isProcessing}
                        >
                            Chiudi
                        </button>
                    </div>
                );
            }
            case "delete": {
                return (
                    <div className="alert-box on-border confirmed">
                        <p>{currentMessage}</p>
                        <button
                            onClick={handleConfirm}
                            className="alert-button confirmed-button mr-2"
                            disabled={internalState.isProcessing}
                        >
                            {internalState.isProcessing ? 'Eliminando...' : 'Si'}
                        </button>
                        <button
                            onClick={closeAlert}
                            className="alert-button confirmed-button mr-[10px]"
                            disabled={internalState.isProcessing}
                        >
                            No
                        </button>
                    </div>
                );
            }
            case "confirm": {
                return (
                    <div className="alert-box on-border bg-slate-100">
                        <h2 className="bg-gray-300 rounded-full w-fit py-1 pr-3 font-bold flex items-center mb-4">
                            <Icon type="working" />
                            {title}
                        </h2>
                        <p>{currentMessage}</p>
                        <button
                            onClick={handlePrintConfirm}
                            className="alert-button on-btn bg-blue-500"
                            disabled={internalState.isProcessing}
                        >
                            {internalState.isProcessing ? 'Stampando...' : 'Conferma'}
                        </button>
                        <button
                            onClick={closeAlert}
                            className="alert-button on-btn bg-red-500 mr-[10px]"
                            disabled={internalState.isProcessing}
                        >
                            Annulla
                        </button>
                    </div>
                );
            }
            case 'confirmed-successfull': {
                return (
                    <div className="alert-box on-border confirmed">
                        <p>{currentMessage}</p>
                        <button
                            onClick={closeAlert}
                            className="alert-button confirmed-button"
                            disabled={internalState.isProcessing}
                        >
                            OK
                        </button>
                    </div>
                );
            }
            case 'update': {
                return (
                    <div className="alert-box on-border update !bg-slate-50">
                        <button 
                            className="fixed bg-red-400 right-10 top-[-20] rounded-t-lg" 
                            onClick={closeAlert}
                            disabled={internalState.isProcessing}
                            aria-label="Chiudi"
                        >
                            <IoClose size={30} className="text-white fixed bg-red-400 right-3 top-3 rounded-full" />
                        </button>
                        <p className="text-black mb-10 font-bold text-2xl text-left">
                            {title || 'Modifica dei dati della balla:'} 
                        </p>
                        <UpdateValuesBale
                            type={alertFor === "update-p" ? "presser" : "wheelman"}
                            objBale={data}
                            handlerClose={closeAlert}
                        />
                    </div>
                );
            }
            default: {
                return (
                    <div className="alert-box on-border error">
                        <h1 className="title-alert" style={{ color: 'red' }}>
                            Tipo di alert non riconosciuto
                        </h1>
                        <p>Tipo: {currentAlertType}</p>
                        <button
                            onClick={closeAlert}
                            className="alert-button error-button"
                        >
                            Chiudi
                        </button>
                    </div>
                );
            }
        }
    }, [
        internalState.alertType, 
        internalState.message, 
        internalState.isProcessing,
        sanitizedAlertType, 
        msg, 
        title, 
        alertFor, 
        data, 
        closeAlert, 
        handleConfirm, 
        handlePrintConfirm
    ]);

    // Se non c'è contenuto, non renderizzare nulla
    if (!alertContent) return null;

    return (
        <div className="overlay">
            <Draggable nodeRef={nodeRef}>
                <div ref={nodeRef} className="draggable-wrapper">
                    {alertContent}
                </div>
            </Draggable>
        </div>
    );
}

Alert.propTypes = {
    title: PropTypes.string,
    msg: PropTypes.string,
    alertFor: PropTypes.string,
    data: PropTypes.object,
    onHide: PropTypes.func
};