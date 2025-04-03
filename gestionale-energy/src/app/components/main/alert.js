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
  
  const { ws } = useWebSocket();
  
  const [sanitize_alertFor, setSanitize] = useState("");
  const [message, setMessage] = useState(""); 
  
  /**
  * @param {boolean} isConfirmed
  */
  const closeAlert = (isConfirmed = false) => {
    try {
      baleObj.setIdBale(null); // annullo la selezione della balla sempre dopo la chiusura dell'alert
      handleClose(isConfirmed); 
      refreshPage(ws);
    } catch (error) {
      setSanitize("error");
      setMessage(error);
    }
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
      return (
        <div className="overlay">
          <div className="alert-box on-border error">
            <h1 className="title-alert" style={{ color: 'red' }}>Errore</h1>
            <p>Errore: {message}</p>
            <button
              onClick={() => closeAlert()}
              className="alert-button error-button"
            >
              Chiudi
            </button>
          </div>
        </div>
      );
    }
    case "note": {
      return (
        <div className="overlay">
          <div className="alert-box on-border note">
            <h1 className="title-alert text-left" style={{ color: 'black' }}>Nota del Pressista:</h1>
            <br />
            <p className="text-left">{message}</p>
            <br />
            <button
              onClick={() => closeAlert(false)}
              className="alert-button note-button"
            >
              Chiudi
            </button>
          </div>
        </div>
      );
    }
  
    case "delete": {
      return (
        <div className="overlay">
          <div className="alert-box on-border confirmed">
            <p>{message}</p>
            <button
              onClick={() => handleConfirm()}
              className="alert-button confirmed-button mr-2"
            >
              Si
            </button>
            <button
              onClick={() => closeAlert()}
              className="alert-button confirmed-button mr-[10px]"
            >
              No
            </button>
          </div>
        </div>
      );
    }

    case "confirmed-print": {
      return (
        <div className="overlay">
          <div className="alert-box on-border bg-slate-100">
            <p>{message}</p>
            <button
              onClick={() => closeAlert(true)}
              className="alert-button on-btn bg-blue-500"
            >
              Conferma
            </button>
            <button
              onClick={() => closeAlert()}
              className="alert-button on-btn bg-red-500 mr-[10px]"
            >
              Annulla
            </button>
          </div>
        </div>
      );
    }
    
    case 'confirmed-successfull': {
      return (
        <div className="overlay">
          <div className="alert-box on-border confirmed">
            <p>{message}</p>
            <button
              onClick={() => closeAlert()}
              className="alert-button confirmed-button"
            >
              OK
            </button>
          </div>
        </div>
      );
    }
  
    case 'update': {
      return (
        <div className="overlay">
          <div className="alert-box on-border update !bg-slate-50">
            <p className="text-black mb-10 font-bold text-2xl text-left">Modifica dei dati della balla: </p>
            <UpdateValuesBale
              type={alertFor === "update-p" ? "presser" : "wheelman"}
              idBale={baleObj.idBale}
              handlerClose={closeAlert}
            />
          </div>
        </div>
      );
    }
  }
}