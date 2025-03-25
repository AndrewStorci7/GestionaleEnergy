'use client';

import React, { useEffect, useState } from "react";
import UpdateValuesBale from "./update-bale";
import { useWebSocket } from "@@/components/main/ws/use-web-socket";
import { refreshPage, getServerRoute, handleDelete } from "@/app/config";

/**
  * @author Daniele Zeraschi from Oppimittinetworking
  * 
  * @param {string}    msg            Stringa dell'errore da stampare
  * 
  * @param {string}    alertFor       Il tipo di alert: [ 'error' | 'note' | 'confirmed' | 'update-p' | 'update-w' ]
  *                                   error: Errore
  *                                   confirmed: Conferma operazione generica
  *                                   note: Visuaizzazione note
  *                                   update-p: Alert per modifica dati balla pressista
  *                                   update-w: Alert per modificare dati balla carrellista
  * 
  * @param {function}  handleClose    Funzione che gestisce la chiusura dell'alert
  * 
  * @param {int}       baleObj        Oggetto composto dai seguenti attributi: { `idBale`(number): id della balla, `setIdBale`(function): gancio per aggiornare l'id in caso di elimina }
  *
  * @param {Function}  handlerMessage Funzione che gestisce l'aggiornamento 
  **/
export default function Alert({
  msg, 
  alertFor,
  handleClose,
  baleObj
}) {

  console.log(baleObj);
  
  const { ws } = useWebSocket();
  
  const [sanitize_alertFor, setSanitize] = useState("");
  const [message, setMessage] = useState(""); 
  
  /**
  * @param {boolean} isConfirmed
  */
  const closeAlert = (isConfirmed = false) => {
    baleObj.setIdBale(null); // annullo la selezione della balla sempre dopo la chiusura dell'alert
    handleClose(isConfirmed); 
    refreshPage(ws);
  };

  /**
   * Gestisce l'aggiornamento della componente
   * @param {string} msg   Messaggio per l'alert 
   * @param {string} scope Tipo di alert 
   */
  const handleDeleteSuccess = (msg, scope) => {
    setSanitize(scope);
    setMessage(msg);
  }
  
  const handleConfirm = async () => {
    try {
      console.log("ID BALLA DENTRO ALERT => " + baleObj.idBale);
      console.log("conferma elimina cliccato");
      await handleDelete(baleObj.idBale, handleDeleteSuccess);
      closeAlert();
    } catch (error) {
      setSanitize("error");
      if (typeof error === 'object') setMessage(error.message);
      else setMessage(error);
    }
  }
  
  useEffect(() => {
    setSanitize(alertFor.startsWith('update') ? 'update' : alertFor);
    setMessage(msg);
  }, [alertFor, msg]);
  
  switch(sanitize_alertFor) {
    case "error": {
      return(
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
            <p>Errore: {message}</p>
            <button
              onClick={() => closeAlert()}
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
      );
    }        
    case "note" : {
      return (
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
            <p>{message}</p>
            <button
              onClick={() => closeAlert()}
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
      );
    }
    case "delete-confirm" : {
      return(
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
            <p>{message}</p>
            <button
              onClick={() => handleConfirm()}
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
              Si
            </button>
            <button
              onClick={() => closeAlert()}
              style={{
                padding: "5px 10px",
                backgroundColor: "seagreen",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "10px",
                marginRight: "10px" , 
              }}
            >
              No
            </button>
          </div>
        </div>
      )
    }
    case "confirmed-print" : {
      return(
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
            <p>{message}</p>
            <button
              onClick={() => closeAlert(true)}
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
              Si
            </button>
            <button
              onClick={() => closeAlert()}
              style={{
                padding: "5px 10px",
                backgroundColor: "seagreen",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "10px",
                marginRight: "10px" , 
              }}
            >
              No
            </button>
          </div>
        </div>
      )
    }
    case 'confirmed-successfull':{
      return(
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
            <p>I dati sono stati inseriti correttamente!</p>
            <button
              onClick={() => closeAlert()}
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
      )
    }
    case 'update': {
      return (
        <div className="bg-neutral-200/50 w-screen h-screen fixed top-0 left-0 z-40">
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              padding: "20px",
              paddingTop: "50px",
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
              idBale={baleObj.idBale}
              // handlerConfirm={handleConfirm}
              handlerConfirm={closeAlert}
            />
          </div>
        </div>
      )
    }
  }
  
}
