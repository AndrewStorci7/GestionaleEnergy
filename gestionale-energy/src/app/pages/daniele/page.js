'use client'

import React, { useEffect } from 'react';
import ErrorAlert from './error-alert';
import CheckCookie from '../../components/main/check-cookie'; 
import { getSrvUrl } from '@@/config';

/*
Task:
creare una funzione che chiami la rotta '/injection' dal server
passandogli come oggetto: { body: <stringa> }

Guardare nel file /serach/select.js come viene fatta la chiamata
*/
const srvurl = getSrvUrl()

export default function Page() { 

  useEffect(() => {
          const fetchData = async () => {
            try {
              const url = srvurl + "/injection"

              if (url != -1) {
                const resp = await fetch(url, {
                  method: 'POST',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify({ body : "$&()&&$$$£££ciao'|\"Ꞧꭂ" }),
              });
                  if (!resp.ok) {
                      throw new Error("Network response was not ok")
                  }
              }
          } catch (error) {
              console.log(error)
          }
      }
      fetchData();
  }, [])

}

