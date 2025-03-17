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
  idBale
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
      return(
        <div className="bg-neutral-200/50 w-screen h-screen fixed top-0 left-0 z-3">
          <div className=""
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
          }}> 
            <p>Errore: {msg ? msg : message}</p>
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
            }}> 
              <p>{msg ? msg : message}</p>
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
              }}>
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
              <p>{msg ? msg : message}</p>
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
              }}>
                No
              </button>
            </div>
          </div>
        </div>
      )
    }
    case 'confirmed-successfull':{
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
                idBale={idBale}
                handlerConfirm={handleConfirm}
              />
            </div>
          </div>
        </div>
      )
    }
  }
  
}
