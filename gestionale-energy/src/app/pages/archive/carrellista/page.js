'use client';

import Cookies from "js-cookie";

import Footer from "@/app/components/footer/foooter";
import Header from "@/app/components/header/header";
import MainContent from "@/app/components/main/main-content";
import { useEffect, useState } from "react";
import ErrorAlert from "../../../components/main/error-alert";

export default function Pressista() {

    const [facility, setFacility] = useState("");
    const [user, setUser] = useState("");
    const [cookies, setCookies] = useState([]);

    useEffect(() => {
        try {
            setCookies(JSON.parse(Cookies.get('user-info')));
            if (cookies) {
                setFacility(cookies.facility);
                setUser(cookies.name);
            }
        } catch (error) {
            //console.log(`Error: ${_err}`);
            <ErrorAlert error={error}/>
        }
        // TODO set data for type user
    }, []);

    return(
        <div className="w-[95%] m-[2.5%]">
            <Header 
                facility={facility}
                username={user}
            />
            <MainContent 
                type={user}
            />
            <Footer />
        </div>
    );
}