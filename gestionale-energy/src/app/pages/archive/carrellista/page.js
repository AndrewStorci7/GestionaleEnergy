'use client';

import Cookies from "js-cookie";

import Footer from "@/app/components/footer/foooter";
import Header from "@/app/components/header/header";
import MainContent from "@/app/components/main/main-content";
import { useEffect, useState } from "react";
import Alert from "../../../components/main/alert";

export default function Pressista() {

    const [facility, setFacility] = useState("");
    const [user, setUser] = useState("");
    const [cookies, setCookies] = useState([]);

    const [messageAlert, setMessageAlert] = useState(null);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        try {
            setCookies(JSON.parse(Cookies.get('user-info')));
            if (cookies) {
                setFacility(cookies.facility);
                setUser(cookies.name);
            }
        } catch (error) {
            setMessageAlert(messageAlert);
            showAlert(prev => !prev);
        }
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
            {(showAlert) && <Alert msg={messageAlert} />}
        </div>
    );
}