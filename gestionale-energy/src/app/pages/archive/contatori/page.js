'use client';
import React from "react";
import CheckCookie from "@/app/components/main/check-cookie";

import RenderCounters from "./renderCounter/render-counters";

import { WebSocketProvider } from "@/app/components/main/ws/use-web-socket";

export default function Contatori() {

    return (
        <WebSocketProvider user={{ user: 'Admin', name: 'Administrator', surname: 'counters' }}>
            <RenderCounters />
        </WebSocketProvider>
    );
}
