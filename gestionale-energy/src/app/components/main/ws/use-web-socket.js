import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { getWsUrl } from '@/app/config';

const wsurl = await getWsUrl();
const WebSocketContext = createContext();

/**
 * Web Socket Provider context
 * @author Andrea Storci from Oppimittinetworking
 * 
 * @param {Object} user     Informazioni dell'utente che si è collegato
 * @param {Object} children  
 */
export const WebSocketProvider = ({ user, children }) => {

    const ws = useRef(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {

        ws.current = new WebSocket(wsurl);

        ws.current.onopen = () => {
            console.log('WebSocket connection opened');
            ws.current.send(JSON.stringify({ type: "new-conncetion", data: user }));
        };

        ws.current.onmessage = (event) => {
            console.log('Message from server:', event.data);
            setMessage(event.data);
        };

        ws.current.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => ws.current.close();
    }, [user]);

    return (
        <WebSocketContext.Provider value={{ ws, message }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);