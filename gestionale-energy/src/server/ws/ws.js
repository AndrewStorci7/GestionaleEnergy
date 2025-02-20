import Console from '../inc/console.js';
// const WebSocket = require('ws')
import WebSocket from 'ws';
// const md5 = require('md5')
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
        this.ws.on('connection', (_ws) => {
            
            console.ws("New User Connected to the server!");

            _ws.send("Welcome to the server!");
            
            _ws.on('message', (message) => {
                
                // console.wsMessage(message)

                try {
                    const parsedMessage = JSON.parse(message);

                    switch (parsedMessage.type) {
                        case "reload": {
                            console.info("Realod websocket type called")
                            this.ws.clients.forEach((client) => {
                                if (client.readyState === WebSocket.OPEN && parsedMessage.data == "___update___") {
                                    client.send(JSON.stringify({ code: 1001, message: md5(Math.floor(Math.random() * (1000 - 0 + 1)) + 0) }));
                                }
                            });
                            break;
                        } 
                        case "new-conncetion": {
                            console.info("New Connection websocket type called")
                            console.ws(`User connected: ${parsedMessage.data.user} (${parsedMessage.data.name} ${parsedMessage.data.surname})`);
                            break;
                        }
                    }
                } catch (error) {
                    console.error("Error parsing message", error);
                }
            })
        })
    }

}

export default WebSocketApp