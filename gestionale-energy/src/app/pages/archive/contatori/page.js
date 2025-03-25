'use client';
import React, { useState, useEffect, useTransition } from "react";
import Cookies from 'js-cookie';
import CheckCookie from "@/app/components/main/check-cookie";

import RenderCounters from "./renderCounter/render-counters";

import { WebSocketProvider } from "@/app/components/main/ws/use-web-socket";

// const cookie = JSON.parse(Cookies.get('user-info'));

export default function Contatori() {
    // const [user, setUser] = useState(cookie.username);
    // const [name, setName] = useState(cookie.name);
    // const [surname, setSurname] = useState(cookie.surname);
    const [user, setUser] = useState('Admin');
    const [name, setName] = useState('Administrator');
    const [surname, setSurname] = useState('counters');

    return (
        <WebSocketProvider user={{ user, name, surname }}>
            <CheckCookie />
            <RenderCounters />
        </WebSocketProvider>
    );
}
