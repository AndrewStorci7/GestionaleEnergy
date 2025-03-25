'use client';

import React, { useEffect, useState } from "react";
import UpdateValuesBale from "./update-bale";
import { useWebSocket } from "@@/components/main/ws/use-web-socket";
import { refreshPage, getServerRoute } from "@/app/config";

/**
* @author Daniele Zeraschi from Oppimittinetworking
* 
* @param {string}    msg          Stringa dell'errore da stampare
* 
* @param {string}    alertFor     Il tipo di alert: [ 'error' | 'note' | 'confirmed' | 'update-p' | 'update-w' ]
*                                 error: Errore
*                               confirmed: Conferma operazione generica
*                               note: Visuaizzazione note
*                               update-p: Alert per modifica dati balla pressista
*                               update-w: Alert per modificare dati balla carrellista
* 
* @param {function}  handleClose  Funzione che gestisce la chiusura dell'alert
* 
* @param {int}       idBale       Id della balla da modificare
*
* @param {Function}  handlerMessage Funzione che gestisce l'aggiornamento 
**/
export default function Alert({
  msg, 
  alertFor,
  handleClose,
  idBale,
  updateBale
}) {
  
  const { ws } = useWebSocket();
  
  const [sanitize_alertFor, setSanitize] = useState("");
  const [message, setMessage] = useState(""); 
  
  /**
  * Elimina una balla 
  * @param {number}      id 
  * @param {Function}    handleAlert
  */
  const handleDelete = async (id) => {
    try {
      const f_id = (typeof id === 'object') ? id[0] : id;
      
      const url = await getServerRoute('delete-bale');
      const check = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({ id_bale: f_id }),
      });
      
      const resp = await check.json();
      
      if (resp.code < 0) {
        // handleAlert(resp.message);
        setMessage(resp.message);
        alertFor = 'error';
      } else {
        // handleAlert(default_message, 'confirmed');
        setMessage("Balla selezionata eliminata correttamente!");
        alertFor = 'confirmed-successfull';
        closeAlert();
      } 

    } catch (error) {
      // handleAlert(error);
      alertFor = 'error';
      setMessage(error);
    }
    updateBale(null, null);
  }
  
  /**
  * @param {boolean} isConfirmed
  */
  const closeAlert = (isConfirmed = false) => {
    handleClose(isConfirmed);
    refreshPage(ws);
  };
  
  const handleConfirm = () => {
    try {
      handleDelete(idBale);
      // closeAlert();
      // refreshPage(ws);
    } catch (error) {
      alertFor = "error";
      msg = error;
    }
  }
  
  useEffect(() => {
    setSanitize(alertFor.startsWith('update') ? 'update' : alertFor);
    msg = message;
  }, [alertFor, msg, message]);
  
  switch(sanitize_alertFor) {
    case "error": {
      return (
        <div className="overlay">
          <div className="alert-box error">
            <p>Errore: {msg ? msg : message}</p>
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
            <p className="text-left">{msg ? msg : message}</p>
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
            <p>{msg ? msg : message}</p>
            <button
              onClick={() => handleConfirm()}
              className="alert-button confirmed-button"
            >
              Si
            </button>
            <button
              onClick={() => closeAlert()}
              className="alert-button confirmed-button"
              style={{ marginRight: "10px" }}
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
            <p>{msg ? msg : message}</p>
            <button
              onClick={() => closeAlert(true)}
              className="alert-button confirmed-button"
            >
              Si
            </button>
            <button
              onClick={() => closeAlert()}
              className="alert-button confirmed-button"
              style={{ marginRight: "10px" }}
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
            <p className="text-black mb-10 font-bold text-2xl text-left">Modifica dei dati della balla: </p>
            <UpdateValuesBale
              type={alertFor === "update-p" ? "presser" : "wheelman"}
              idBale={idBale}
              handlerConfirm={closeAlert}
            />
          </div>
        </div>
      );
    }
  }
}