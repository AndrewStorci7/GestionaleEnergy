'use client';

import Cookies from "js-cookie";

import Footer from "@@/components/footer/foooter";
import Header from "@@/components/header/header";
import MainContent from "@@/components/main/main-content";
import { useEffect, useState } from "react";

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
        } catch (_err) {
            console.log(`Error: ${_err}`);
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