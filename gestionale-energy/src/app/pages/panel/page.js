'use client';

import Cookies from "js-cookie";

import Footer from "@/app/components/footer/foooter";
import Header from "@/app/components/header/header";
import MainContent from "@/app/components/main/main-content";
import { useEffect, useState } from "react";
import Alert from "@/app/components/main/alert";
import CheckCookie from "@/app/components/main/check-cookie";
import { getWsUrl } from "@/app/config";
import { WebSocketProvider } from '@@/components/main/ws/use-web-socket';

const wsurl = getWsUrl();

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

    // istanza del Web Socket
    const [ws, setWs] = useState(null);
    
    useEffect(() => {

        const _ws = new WebSocket(wsurl);

        _ws.onopen = () => {
            console.log('Connected to the WebSocket server');
        };

        _ws.onmessage = (event) => {
            console.log('Message from server:', event.data);
        };

        setWs(_ws);

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
                }else(CheckCookie())
            } catch (error) {
                //console.log(`Error: ${_err}`);
                <Alert msg={error}/>
            }
        }

        fetchData();

        if (_ws && _ws.readyState === WebSocket.OPEN) {
            _ws.send(`User ${user} (${name} ${surname}) connected to the server`);
        }

        return () => _ws.close();
    }, []);

    return(
        <WebSocketProvider>
            <div className="w-[98%] m-[1%] overflow-hidden">
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
        </WebSocketProvider>
    );
}