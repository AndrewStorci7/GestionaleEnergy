'use client';
import React, { useState } from "react";
import CheckCookie from "@/app/components/main/check-cookie";

import RenderCounters from "./renderCounter/render-counters";

import { WebSocketProvider } from "@/app/components/main/ws/use-web-socket";

export default function Contatori() {

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
