import React, { 
    createContext, 
    useContext, 
    useEffect, 
    useRef, 
    useState 
} from 'react';
import { getWsUrl } from '@config';
import CheckCookie from '../check-cookie';

import PropTypes from 'prop-types'; // per ESLint

const wsurl = getWsUrl();
const WebSocketContext = createContext();

/**
 * Web Socket Provider context
 * @author Andrea Storci from Oppimittinetworking
 * 
 * @param {Object} user     Informazioni dell'utente che si è collegato
 * @param {Object} children  
 */
export const WebSocketProvider = ({ 
    user, 
    children 
}) => {

    const ws = useRef(null);
    const [message, setMessage] = useState(null);

    /**
     * 
     * @returns oggetto contenente le informazioni del dispositivo e del browser 
     */
    async function getUserDeviceInfo() {
        let userInfo = {
            user: user,
            userAgent: navigator.userAgent, // Info generali
            language: navigator.language,  // Lingua del browser
        };
    
        if (navigator.userAgentData) {
            const userAgentData = await navigator.userAgentData.getHighEntropyValues([
                "platform",
                "model",
                "uaFullVersion"
            ]);
    
            userInfo.platform = userAgentData.platform; // OS
            userInfo.device = userAgentData.model || "Unknown"; // Modello dispositivo (solo mobile)
            userInfo.browserVersion = userAgentData.uaFullVersion;
        }
        return userInfo;
    }

    useEffect(() => {

        ws.current = new WebSocket(wsurl);

        ws.current.onopen = async () => {
            const userInfo = await getUserDeviceInfo();

            if (ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(JSON.stringify({ type: "new-connection", data: userInfo }));
            } else {
                // console.warn("WebSocket is not open yet. Retrying...");
                setTimeout(() => {
                    if (ws.current.readyState === WebSocket.OPEN) {
                        ws.current.send(JSON.stringify({ type: "new-connection", data: userInfo }));
                    }
                }, 300);
            }
        };

        ws.current.onmessage = (event) => {
            setMessage(event.data);
        };

        ws.current.onclose = () => {
            // console.log('WebSocket connection closed');
        };

        return () => ws.current.close();
    }, [user]);

    return (
        <WebSocketContext.Provider value={{ ws, message }}>
            {children}
            <CheckCookie />
        </WebSocketContext.Provider>
    );
};

WebSocketProvider.propTypes = {
    user: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired
};

export const useWebSocket = () => useContext(WebSocketContext);