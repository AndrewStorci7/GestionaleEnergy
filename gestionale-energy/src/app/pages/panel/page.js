'use client';

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Head from "next/head";

import Footer from "@components/footer/footer";
import Header from "@components/header/header";
import MainContent from "@main/main-content";

import { WebSocketProvider } from '@main/ws/use-web-socket';
import { AlertProvider } from "@main/alert/alertProvider";
import { LoaderProvider, useLoader } from "@main/loader/loaderProvider";
import PropTypes from "prop-types"; // per ESLint

const AdminContent = ({
    data
}) => {

    const { showLoader } = useLoader();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        showLoader(!loaded)
    }, [loaded])

    useEffect(() => {
        setLoaded(true)
    }, [])

    return (
        <div className="w-[99%] m-[0.5%] overflow-hidden">
            <Header 
                implant={data.implant}
                username={data.user}
                type={data.type}
                name={data.name}
                surname={data.surname}
            />
            <MainContent 
                type={data.type}
                implant={data.idImplant}
                idUser={data.idUser}
            />
            <Footer />
        </div>
    )
}

AdminContent.propTypes = {
    data: PropTypes.shape ({
        implant: PropTypes.string,
        user: PropTypes.string,
        type: PropTypes.string,
        name: PropTypes.string,
        surname: PropTypes.string,
        idImplant: PropTypes.number,
        idUser: PropTypes.number,        
    })
};
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
        }

        fetchData();
    }, []);

    return(
        <LoaderProvider>
            <WebSocketProvider user={{ user, name, surname }}>
                <Head>
                    <title>Pannello – Oppimitti Energy</title>
                    <link rel="icon" href="/logoon.ico" />
                </Head>

                <AlertProvider>
                    <AdminContent data={{
                        implant,
                        idImplant,
                        idUser,
                        user,
                        name,
                        surname,
                        type
                    }} />
                </AlertProvider>
            </WebSocketProvider>
        </LoaderProvider>
    );
}