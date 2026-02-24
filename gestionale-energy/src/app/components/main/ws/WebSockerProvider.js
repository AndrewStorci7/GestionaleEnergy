import { getWsUrl } from "@config";
import PropTypes from "prop-types"; // per ESLint
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import CheckCookie from "../CheckCookies";

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
	// const getUserDeviceInfo = useCallback(async () => {
	const getUserDeviceInfo = async () => {
		const userInfo = {
			user: user,
			userAgent: navigator.userAgent, // Info generali
			language: navigator.language, // Lingua del browser
		};

		if (navigator.userAgentData) {
			const userAgentData = await navigator.userAgentData.getHighEntropyValues([
				"platform",
				"model",
				"uaFullVersion",
			]);

			userInfo.platform = userAgentData.platform; // OS
			userInfo.device = userAgentData.model || "Unknown"; // Modello dispositivo (solo mobile)
			userInfo.browserVersion = userAgentData.uaFullVersion;
		}

		return userInfo;
	}
	// , [])

	useEffect(() => {
		ws.current = new WebSocket(wsurl);

		ws.current.onopen = async () => {
			const userInfo = await getUserDeviceInfo();

			if (ws.current.readyState === WebSocket.OPEN) {
				ws.current.send(
					JSON.stringify({ type: "new-connection", data: userInfo }),
				);
			} else {
				setTimeout(() => {
					if (ws.current.readyState === WebSocket.OPEN) {
						ws.current.send(
							JSON.stringify({ type: "new-connection", data: userInfo }),
						);
					}
				}, 300);
			}
		};

		ws.current.onmessage = (event) => {
			setMessage(event.data);
		};

		// ws.current.onclose = () => {};

		return () => ws.current.close();
	}, [getUserDeviceInfo]);

	return (
		<WebSocketContext.Provider value={{ ws, message }}>
			{children}
			<CheckCookie />
		</WebSocketContext.Provider>
	);
};

WebSocketProvider.propTypes = {
	user: PropTypes.object.isRequired,
	children: PropTypes.node.isRequired,
};

export const useWebSocket = () => useContext(WebSocketContext);
