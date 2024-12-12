'use client';

import Cookies from "js-cookie";

import Footer from "@/app/components/footer/foooter";
import Header from "@/app/components/header/header";
import MainContent from "@/app/components/main/main-content";
import { useEffect, useState } from "react";

export default function Admin() {

    const [implant, setImplant] = useState("");
    // const [idUser, setIdUser] = useState("");
    const [user, setUser] = useState("");
    const [type, setType] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const cookies = await JSON.parse(Cookies.get('user-info'));
                if (cookies) {
                    setImplant(cookies.implant);
                    setUser(cookies.name);
                    setType(cookies.type);
                    // setIdUser(cookies.id_user);
                }
            } catch (_err) {
                console.log(`Error: ${_err}`);
            }
        }

        fetchData();
        
        // TODO set data for type user
    }, []);

    return(
        <div className="w-[95%] m-[2.5%]">
            <Header 
                implant={implant}
                username={user}
            />
            <MainContent 
                type={type}
                implant={implant}
                idUser={idUser}
            />
            <Footer />
        </div>
    );
}