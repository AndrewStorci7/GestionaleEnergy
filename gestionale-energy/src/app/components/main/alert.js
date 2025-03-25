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
      return (
        <div className="overlay">
          <div className="alert-box error">
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
          <div className="alert-box note">
            <p className="text-left font-bold">Nota del Pressista:</p>
            <br />
            <p className="text-left">{message}</p>
            <br />
            <button
              onClick={() => closeAlert()}
              className="alert-button note-button"
            >
              Chiudi
            </button>
          </div>
        </div>
      );
    }
    case "confirmed": {
      return (
        <div className="overlay">
          <div className="alert-box confirmed">
            <p>{message}</p>
            <button
              onClick={() => handleConfirm()}
              className="alert-button confirmed-button"
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
          <div className="alert-box confirmed-print">
            <p>{message}</p>
            <button
              onClick={() => closeAlert(true)}
              className="alert-button confirmed-button"
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
    case 'confirmed-successfull': {
      return (
        <div className="overlay">
          <div className="alert-box confirmed">
            <p>I dati sono stati inseriti correttamente!</p>
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
          <div className="alert-box update">
            <p className="mb-10 font-bold">Modifica dei dati della balla: </p>
            <UpdateValuesBale
              type={alertFor === "update-p" ? "presser" : "wheelman"}
              idBale={baleObj.idBale}
              handlerConfirm={closeAlert}
            />
          </div>
        </div>
      );
    }
  }
}