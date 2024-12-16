'use client';

import Cookies from "js-cookie";

import Footer from "@/app/components/footer/foooter";
import Header from "@/app/components/header/header";
import MainContent from "@/app/components/main/main-content";
import { useEffect, useState } from "react";
import ErrorAlert from "../../../components/main/error-alert";

export default function Pressista() {

    const [implant, setImplant] = useState("");
    const [user, setUser] = useState("");
    const [cookies, setCookies] = useState([]);
    const [type, setType] = useState("");

    useEffect(async () => {
        try {
            setCookies(JSON.parse(await Cookies.get('user-info')));
            if (cookies) {
                setImplant(cookies.implant);
                setUser(cookies.name);
                setType(Cookies.type);
            }
        } catch (error) {
            //console.log(`Error: ${_err}`);
            <ErrorAlert msg={error}/>
        }
        
        // TODO set data for type user
    }, []);

    console.log(`Cookies { \n\tUsername: ${username};\n\tType: ${type};\n\tImplant: ${implant}`)

    return(
        <div className="w-[95%] m-[2.5%]">
            <Header 
                facility={implant}
                username={user}
            />
            <MainContent 
                type={type}
            />
            <Footer />
        </div>
    );
}