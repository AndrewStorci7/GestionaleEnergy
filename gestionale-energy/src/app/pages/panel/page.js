'use client';

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Head from "next/head";

import Footer from "@/app/components/footer/footer";
import Header from "@/app/components/header/header";
import MainContent from "@main/main-content";
import CheckCookie from "@main/check-cookie";

import { WebSocketProvider } from '@main/ws/use-web-socket';
import { AlertProvider } from "@/app/components/main/alert/alertProvider";
import { LoaderProvider } from "@/app/components/main/loader/loaderProvider";

export default function Admin() {

    // Impianto
    const [implant, setImplant] = useState("");
    // Id Impianto
    const [idImplant, setIdImplant] = useState("");
    // Id Utente
    const [idUser, setIdUser] = useState("");
    // Utente
    const [user, setUser] = useState("");
    // Nome
    const [name, setName] = useState("");
    // Cognome
    const [surname, setSurname] = useState("");
    // Tipo utente [ 'admin' | 'presser' | 'wheelman' | 'both' ]
    const [type, setType] = useState("");
    // const { showAlert } = useAlert();
    
    useEffect(() => {
        async function fetchData() {
            // try {

                const cookies = await JSON.parse(Cookies.get('user-info'));
                
                if (cookies) {
                    setImplant(cookies.implant);
                    setIdImplant(cookies.id_implant);
                    setIdUser(cookies.id_user);
                    setUser(cookies.username);
                    setType(cookies.type);
                    setName(cookies.name);
                    setSurname(cookies.surname);
                }  
            // } catch (error) {
            //     // console.log(`Error: ${error}`);
            //     // showAlert({
            //     //     title: "Error",
            //     //     message: "Failed to load user data. Please log in again.",
            //     //     type: "error",
            //     // });
            // }
        }

        fetchData();
    }, []);

    return(
        <WebSocketProvider user={{ user, name, surname }}>
            <Head>
                <title>Pannello – Oppimitti Energy</title>
                <link rel="icon" href="/logoon.ico" />
            </Head>
            <LoaderProvider>
                <AlertProvider>
                    <div className="w-[99%] m-[0.5%] overflow-hidden">
                        <CheckCookie/>
                        <Header 
                            implant={implant}
                            username={user}
                            type={type}
                            name={name}
                            surname={surname}
                        />
                        <MainContent 
                            type={type}
                            implant={idImplant}
                            idUser={idUser}
                        />
                        <Footer />
                    </div>
                </AlertProvider>
            </LoaderProvider>
        </WebSocketProvider>
    );
}