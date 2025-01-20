import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { getWsUrl } from '@/app/config';

const wsurl = getWsUrl();
const WebSocketContext = createContext();

/**
 * Web Socket Provider context
 * @author Andrea Storci from Oppimittinetworking
 * 
 * @param {*} param0 
 * @returns 
 */
export const WebSocketProvider = ({ children }) => {

    const ws = useRef(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        ws.current = new WebSocket(wsurl);

        ws.current.onopen = () => {
            console.log('WebSocket connection opened');
        };

        ws.current.onmessage = (event) => {
            console.log('Message from server:', event.data);
            setMessage(event.data);
        };

        ws.current.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => ws.current.close();
    }, []);

    return (
        <WebSocketContext.Provider value={{ws, message}}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);