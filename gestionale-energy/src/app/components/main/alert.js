'use client';

import React, { useEffect, useRef, useState } from "react";
import UpdateValuesBale from "./update-bale";
import { useWebSocket } from "@@/components/main/ws/use-web-socket";
import { refreshPage, getServerRoute, handleDelete } from "@/app/config";
import Draggable from "react-draggable";

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

  const nodeRef = useRef(null); // per risolvere il problema di react-draggable essendo `findDOMNode` deprecato
  
  const { ws } = useWebSocket();
  
  const [sanitize_alertFor, setSanitize] = useState("");
  const [message, setMessage] = useState(""); 
  
  /**
  * @param {boolean} isConfirmed
  */
  const closeAlert = (isConfirmed = false) => {
    try {
      if (typeof baleObj !== undefined && baleObj !== undefined) baleObj.setIdBale(null); // annullo la selezione della balla sempre dopo la chiusura dell'alert
      handleClose(isConfirmed); 
      refreshPage(ws);
    } catch (error) {
      setSanitize("error");
      if (typeof error === 'object') setMessage(error.message);
      else setMessage(error);
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
  
  const renderAlert = () => {
    switch(sanitize_alertFor) {
      case "error": {
        return (
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
        );
      }
      case "note": {
        return (
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
        );
      }
      case "delete": {
        return (
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
        );
      }
      case "confirmed-print": {
        return (
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
        );
      }
      case 'confirmed-successfull': {
        return (
            <div className="alert-box on-border confirmed">
              <p>{message}</p>
              <button
                onClick={() => closeAlert()}
                className="alert-button confirmed-button"
              >
                OK
              </button>
            </div>
        );
      }
      case 'update': {
        return (
            <div className="alert-box on-border update !bg-slate-50">
              <p className="text-black mb-10 font-bold text-2xl text-left">Modifica dei dati della balla: </p>
              <UpdateValuesBale
                type={alertFor === "update-p" ? "presser" : "wheelman"}
                objBale={baleObj}
                handlerClose={closeAlert}
              />
            </div>
        );
      }
      default: {
        return (
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
        );
      }
    }
  }

  const alertContent = renderAlert();

  if (!alertContent) return null;

  return (
    <div className="overlay">
      <Draggable
      nodeRef={nodeRef}>
        <div 
        ref={nodeRef} 
        className="draggable-wrapper"
        >
          {alertContent}
        </div>
      </Draggable>
    </div>
  )
}