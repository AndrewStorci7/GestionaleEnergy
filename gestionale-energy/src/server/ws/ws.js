import Console from '../inc/console.js';
import * as UAParser from 'ua-parser-js';
import WebSocket from 'ws';
import md5 from 'md5'; 

const console = new Console("WebSocketApp");

/**
 * Web Socket class
 * 
 * @author Andrea Storci from Oppimittinetworking
 */
class WebSocketApp {

    constructor(ws, server) {
        // this.ws = (ws !== null && ws) ? ws : new WebSocket.Server({ server });
        this.ws = ws;
    }

    onConnection() {
        this.ws.on('connection', (_ws, req) => {
            const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            console.ws("New User Connected to the server! ", `[IP: ${ip}]`);

            _ws.send("Welcome to the server!");
            
            _ws.on('message', (message) => {
                try {
                    const parsedMessage = JSON.parse(message);
                    // console.info(parsedMessage);
                    switch (parsedMessage.type) {
                        case "reload": {
                            // console.info("Realod websocket type called")
                            this.ws.clients.forEach((client) => {
                                if (client.readyState === WebSocket.OPEN && parsedMessage.data == "___update___") {
                                    client.send(JSON.stringify({ code: 1001, message: md5(Math.floor(Math.random() * (1000 - 0 + 1)) + 0) }));
                                }
                            });
                            break;
                        } 
                        case "new-connection": {
                            // console.info(parsedMessage);
                            if (parsedMessage.data.user) {
                                const parser = new UAParser.UAParser(parsedMessage.data.userAgent);
                                const deviceInfo = {
                                    browser: parser.getBrowser().name || "Unknown",
                                    browserVersion: parsedMessage.data.browserVersion || "Unknown",
                                    os: parsedMessage.data.platform || parser.getOS().name || "Unknown",
                                    device: parsedMessage.data.device || parser.getDevice().model || "Unknown",
                                };

                                const strInfo = `\n*BROWSER*: ${deviceInfo.browser}\n*BROWSER VERSION*: ${deviceInfo.browserVersion}\n*OPERATING SYSTEM*: ${deviceInfo.os}\n*DEVICE NAME*: ${deviceInfo.device}`;
                                console.conn(`\nUser connected: ${parsedMessage.data.user.user} (${parsedMessage.data.user.name} ${parsedMessage.data.user.surname}) ${strInfo}`);
                            }

                            break;
                        }
                    }
                } catch (error) {
                    console.error("Error parsing message: " + error);
                }
            })
        })
    }

}

export default WebSocketApp;