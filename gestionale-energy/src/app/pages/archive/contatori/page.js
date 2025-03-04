'use client';

import React, { useState, useEffect, useTransition } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { getSrvUrl } from '@@/config';
import Cookies from 'js-cookie';
import CheckCookie from "@/app/components/main/check-cookie";

import RenderCounters from "./renderCounter/render-counters";

import { WebSocketProvider, useWebSocket } from "@/app/components/main/ws/use-web-socket";

const srvurl = getSrvUrl();

const cookie = JSON.parse(Cookies.get('user-info'));

export default function Contatori() {

    const [user, setUser] = useState(cookie.username);
    const [name, setName] = useState(cookie.name);
    const [surname, setSurname] = useState(cookie.surname);

    

    return (
        <WebSocketProvider user={{ user, name, surname }}>
            <CheckCookie />
            <RenderCounters />
        </WebSocketProvider>
    );
}
