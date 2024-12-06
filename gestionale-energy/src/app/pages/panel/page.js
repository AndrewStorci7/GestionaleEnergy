'use client';

import Cookies from "js-cookie";

import Footer from "@/app/components/footer/foooter";
import Header from "@/app/components/header/header";
import MainContent from "@/app/components/main/main-content";
import { useEffect, useState } from "react";

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

    useEffect(() => {
        async function fetchData() {
            try {
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
            } catch (_err) {
                console.log(`Error: ${_err}`);
            }
        }

        fetchData();
    }, []);

    return(
        <div className="w-[95%] m-[2.5%] overflow-hidden">
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
    );
}