import React, { 
    createContext, 
    useContext, 
    useEffect, 
    useRef, 
    useState 
} from 'react';
import { getWsUrl } from '@/app/config';

const wsurl = getWsUrl();
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
            // console.log('WebSocket connection opened');

            const userInfo = await getUserDeviceInfo();

            ws.current.send( JSON.stringify({ type: "new-connection", data: userInfo }));
        };

        ws.current.onmessage = (event) => {
            // console.log('Message from server:', event.data);
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
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);