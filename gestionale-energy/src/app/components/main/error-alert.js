'use client';

import React, { useState } from "react";

/**
 * 
 * @param {string}  msg         Stringa dell'errore da stampare
 * 
 * @param {string}  alertFor    Il tipo di alert: [ 'error' | 'note' ]
 * 
 * @returns 
 */
export default function ErrorAlert({ msg, alertFor }) {

    // TODO
    // Controllare la prop alertFor e settare in base al suo valore le variabili globali

    const [showAlert, setShowAlert] = useState(true);
    
    const handleClose = () => {
        setShowAlert(false);
    };

    return (
        <div>
            {showAlert && (
                <div className="bg-neutral-200/50 w-screen h-screen fixed top-0 left-0 z-40">
                    <div
                        style={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            padding: "20px",
                            backgroundColor: "rgba(255, 0, 0, 1)",
                            color: "white",
                            borderRadius: "5px",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            zIndex: 999,
                            textAlign: "center",
                        }}
                    >
                        <p>Errore: {msg}</p>
                        <button
                            onClick={handleClose}
                            style={{
                                padding: "5px 10px",
                                backgroundColor: "darkred",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                marginTop: "10px",
                            }}
                        >
                            Chiudi
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
