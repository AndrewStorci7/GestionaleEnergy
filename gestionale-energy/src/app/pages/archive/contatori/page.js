'use client';
import React, { useState } from "react";
import Head from "next/head";
import CheckCookie from "@/app/components/main/check-cookie";

import RenderCounters from "./renderCounter/render-counters";

import { WebSocketProvider } from "@/app/components/main/ws/use-web-socket";

// export const metadata = {
// 	title: "Contatori – Oppimitti Energy",
// 	description: "Gestionale che automatizza la gestione delle balle",
// 	icons: {
// 	  	icon: "/logoon.ico"
// 	}
// };

export default function Contatori() {

    const [user, setUser] = useState('Admin');
    const [name, setName] = useState('Administrator');
    const [surname, setSurname] = useState('counters');

    return (
        <>
            <WebSocketProvider user={{ user, name, surname }}>
                <CheckCookie />
                <RenderCounters />
            </WebSocketProvider>
        </>
    );
}
