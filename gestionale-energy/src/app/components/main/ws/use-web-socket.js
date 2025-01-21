import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { getWsUrl } from '@/app/config';
// import { WebSocket } from 'ws';

const wsurl = getWsUrl();
console.log(wsurl)
const WebSocketContext = createContext();

/**
 * Web Socket Provider context
 * @author Andrea Storci from Oppimittinetworking
 * 
 * @param {Object} children  
 */
export const WebSocketProvider = ({ children }) => {

    const ws = useRef(null);
    // const [ws, setWs] = useState(null)
    const [message, setMessage] = useState(null);

    useEffect(() => {
        ws.current = new WebSocket(wsurl);
        // const websocket = new WebSocket(wsurl)

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

        // setWs(websocket)

        return () => ws.current.close();
    }, []);

    return (
        <WebSocketContext.Provider value={{ws, message}}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);