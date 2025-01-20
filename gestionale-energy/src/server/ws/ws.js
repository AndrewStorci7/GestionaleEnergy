const Console = require('../inc/console')
const WebSocket = require('ws')

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
                
                console.wsMessage(message)
                
                this.ws.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN && message === "__update") {
                        client.send({ code: 1001, message: "refresh_new_data" });
                    }
                });
            })
        })
    }

    // onMessage(message) {
        
    // }

}

module.exports = WebSocketApp