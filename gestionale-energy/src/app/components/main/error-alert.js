'use client';

import React, { useState } from "react";

/**
 * @author Daniele Zeraschi from Oppimittinetworking
 * 
 * @param {string}  msg         Stringa dell'errore da stampare
 * 
 * @param {string}  alertFor    Il tipo di alert: [ 'error' | 'note' | 'confirmed']
 * 
 * @param {function}  handleFor Funzioen che gestisce la chiusura dell'alert
 * 
 * @returns 
 */
export default function ErrorAlert({
  msg, 
  alertFor,
  handleClose
}) {

    // TODO
    // Controllare la prop alertFor e settare in base al suo valore le variabili globali

    const [showAlert, setShowAlert] = useState(true);

    const closeAlertNote = () => {
        setShowAlert(false);
        handleClose();
    };

    const closeAlert = () => {
      setShowAlert(false);
      
  };
    const refreshPage = () => {
      location.reload();
    };

    const handleConfirmedClose = () => {
      closeAlert();
      window.location.reload(); 
  };

    switch(alertFor) {
        case "error": {
            return(
                <>
                  {showAlert && (
                    <div className="bg-neutral-200/50 w-screen h-screen fixed top-0 left-0 z-3">
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
                          onClick={closeAlert}
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
              </>
            );
        }        case "note" : {
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
                                  backgroundColor: "rgb(255, 238, 84)",
                                  color: "white",
                                  borderRadius: "5px",
                                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                  zIndex: 999,
                                  textAlign: "center",
                              }}
                          > 
                              <p>{msg}</p>
                              <button
                                  onClick={closeAlertNote}
                                  style={{
                                      padding: "5px 10px",
                                      backgroundColor: "orange",
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
      // Altri case per "error" e "confirmed" rimangono invariati
        case "confirmed" : {
          return(
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
                        backgroundColor: "rgb(5, 181, 61)",
                        color: "white",
                        borderRadius: "5px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        zIndex: 1,
                        textAlign: "center",
                      }}
                      > 
                        <p>I dati sono stati salvati correttamente</p>
                        <button
                        onClick={() => {
                          closeAlert();
                          refreshPage();
                        }}
                        style={{
                            padding: "5px 10px",
                            backgroundColor: "seagreen",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            marginTop: "10px",
                        }}
                      >
                        OK
                      </button>
                   </div>
                </div>
              )}
             </div>
          )
      }
    }
    
}
