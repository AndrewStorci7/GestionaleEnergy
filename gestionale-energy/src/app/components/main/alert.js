'use client';

import React, { useEffect, useState } from "react";
import TableHeader from "./table/table-header";
import UpdateValuesBale from "./update-bale";

/**
 * @author Daniele Zeraschi from Oppimittinetworking
 * 
 * @param {string}    msg         Stringa dell'errore da stampare
 * 
 * @param {string}    alertFor    Il tipo di alert: [ 'error' | 'note' | 'confirmed' | 'update-p' | 'update-w' ]
 *                                error: Errore
  *                               confirmed: Conferma operazione generica
  *                               note: Visuaizzazione note
  *                               update-p: Alert per modifica dati balla pressista
  *                               update-w: Alert per modificare dati balla carrellista
 * 
 * @param {function}  handleClose Funzione che gestisce la chiusura dell'alert
 * 
 * @param {int}       idBale      Id della balla da modificare
 */
export default function Alert({
  msg, 
  alertFor,
  handleClose,
  idBale
}) {
    // console.log("Id balla all'interno di Alert:" + idBale)

    // TODO
    // Controllare la prop alertFor e settare in base al suo valore le variabili globali
    const _CMNSTYLE_TD = "on-table-td";
    const [sanitize_alertFor, setSanitize] = useState("")
    const [showAlert, setShowAlert] = useState(true);

    const closeAlert = () => {
      setShowAlert(false);
      handleClose();
    };
    
    const refreshPage = () => {
      location.reload();
    };

    const handleConfirmedClose = () => {
      closeAlert();
      window.location.reload();
    };

    useEffect(() => {
      setSanitize(alertFor.startsWith('update') ? 'update' : alertFor)
    }, [alertFor])

    switch(sanitize_alertFor) {
        case "error": {
            return(
                <>
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
              </>
            );
        }        
        case "note" : {
          return (
              <div>
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
                                  onClick={closeAlert}
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
              </div>
          );
      }
      // Altri case per "error" e "confirmed" rimangono invariati
      case "confirmed" : {
        return(
            <div>
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
                      <p>{msg ? msg : "I dati sono stati inseriti correttamente!"}</p>
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
            </div>
        )
      }
      case 'update': {
        return (
          <div>
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

                <UpdateValuesBale 
                  type={(alertFor === "update-p") ? "presser" : "wheelman"} 
                  idBale={idBale}
                  handlerConfirm={() => closeAlert()}
                />
                
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
          </div>
        )
      }
    }
    
}
