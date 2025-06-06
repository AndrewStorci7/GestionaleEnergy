'use client';
import React, { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";

import UpdateValuesBale from "@main/update-bale";
import { useWebSocket } from "@main/ws/use-web-socket";
import { useAlert } from "@main/alert/alertProvider";
import { handleDelete } from "@main/fetch";

import { refreshPage } from "@/app/config";

/**
* @author Daniele Zeraschi from Oppimittinetworking
* 
* @param {string}    msg        Stringa dell'errore da stampare
* @param {string}    alertFor   Il tipo di alert:
* * `error`: Errore
* * `confirm`: Conferma operazione generica
* * `note`: Visuaizzazione note
* * `update-p`: Alert per modifica dati balla pressista
* * `update-w`: Alert per modificare dati balla carrellista
* @param {function}  onCancel   Funzione che gestisce la chiusura dell'alert
* @param {Function}  onConfirm  Funzione che gestisce la conferma 
* @param {object}    data       Oggetto composto dai seguenti attributi: 
* * `idBale`[`number`]: id della balla
* * `setIdBale`[`function`]: gancio per aggiornare l'id in caso di elimina
* * `idUnique`[`number`]: id unico della balla totale
**/
export default function Alert({
  title = null,
  msg = null, 
  alertFor = null,
  onCancel,
  onConfirm,
  data
}) {

  // console.log("Data passed to Alert: ", data);

  const nodeRef = useRef(null); // per risolvere il problema di react-draggable essendo `findDOMNode` deprecato
  const { showAlert, hideAlert } = useAlert(); 
  const { ws } = useWebSocket();
  
  const [sanitize_alertFor, setSanitize] = useState("");
  const [message, setMessage] = useState(""); 
  
  const cancel = onCancel || (() => hideAlert());
  const confirm = onConfirm || (() => hideAlert());
  
  /**
  * @param {boolean} isConfirmed
  */
  const closeAlert = (isConfirmed = false) => {
    try {
      if (data !== null && typeof data !== undefined) {
        data.setIdBale(null); // annullo la selezione della balla sempre dopo la chiusura dell'alert
        // refreshPage(ws);
      } 
      cancel(); 
    } catch (error) {
      setSanitize("error");
      if (typeof error === 'object') { 
        setMessage(error.message);
      } else {
        setMessage(error);
      }
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
      await handleDelete(data.idBale, handleDeleteSuccess);
      cancel();
    } catch (error) {
      setSanitize("error");
      if (typeof error === 'object') {
        setMessage(error.message);
      } else {
        setMessage(error);
      }
    }
  }
  
  useEffect(() => {
    setSanitize(alertFor.startsWith('update') ? 'update' : alertFor);
    setMessage(msg);
  }, [alertFor, msg]);
  
  const renderAlert = () => {
    switch(sanitize_alertFor) {
      default:
      case "error": {
        return (
          <div className="alert-box on-border error">
            <h1 className="title-alert" style={{ color: 'red' }}>
              {title || 'Errore'}
            </h1>
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
            <h1 className="title-alert text-left" style={{ color: 'black' }}>
              {title || 'Nota scritta dall\'utente'}
            </h1>
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
      case "confirm": {
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
    }
  }

  const alertContent = renderAlert();

  if (!alertContent) return null;

  return (
    <div className="overlay">
      <Draggable nodeRef={nodeRef}>
        <div ref={nodeRef} className="draggable-wrapper">
          {alertContent}
        </div>
      </Draggable>
    </div>
  )
}