'use client';
import React from "react";
import RenderCounters from "./renderCounter/render-counters";
import { WebSocketProvider } from "@main/ws/use-web-socket";
import { LoaderProvider } from "@main/loader/loaderProvider";

export default function Contatori() {

    return (
        <LoaderProvider>
            <WebSocketProvider user={{ user: 'Admin', name: 'Administrator', surname: 'counters' }}>
                <RenderCounters />
            </WebSocketProvider>
        </LoaderProvider>
    );
}
