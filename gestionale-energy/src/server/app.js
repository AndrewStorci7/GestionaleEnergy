/**
 * Express App Configuration
 * 
 * @author Andrea Storci from Oppimittinetworking
 */

// Configuring .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./inc/db');
const WebSocket = require('ws')

const presserRoute = require('./routes/presser');
const wheelmanRoute = require('./routes/wheelman');
const totalBaleRoute = require('./routes/total-bale');
const plasticRoute = require('./routes/plastic');
const cdbpRoute = require('./routes/cdbp');
const cdbcRoute = require('./routes/cdbc');
const warehouseRoute = require('./routes/warehouse');
const reiRoute = require('./routes/rei');
const selectedBaleRoute = require('./routes/selected-bale');
const reasonRouter = require('./routes/reason');
const implantRouter = require('./routes/implant');
const loginRouter = require('./routes/loginroutes');
const reportRouter = require('./routes/report');
const WebSocketApp = require('./ws/ws')

const app = express();
const ADDRESS = process.env.NEXT_PUBLIC_APP_ADDRESS_DEV;
const PORT = process.env.NEXT_PUBLIC_APP_SERVER_PORT;
const URL = process.env.NEXT_PUBLIC_APP_SERVER_URL;
const server = require('http').createServer(app)
const wss = new WebSocket.Server({ server })
const wsa = new WebSocketApp(wss)

wsa.onConnection();

// Middleware to parse in JSON
app.use(express.json());
// Allow CORS
app.use(cors());

app.use(loginRouter(db));

app.use(presserRoute(db, "presser_bale"));
app.use(wheelmanRoute(db, "wheelman_bale"));
app.use(totalBaleRoute(db, "pb_wb"));
app.use(plasticRoute(db, "code_plastic"));
app.use(cdbpRoute(db, "cond_presser_bale"));
app.use(cdbcRoute(db, "cond_wheelman_bale"));
app.use(warehouseRoute(db, "warehouse_dest"));
app.use(reiRoute(db, "rei"));
app.use(selectedBaleRoute(db, "selected_bale"));
app.use(reasonRouter(db, "reas_not_tying"));
app.use(implantRouter(db, "implants"));
app.use(reportRouter(db));

server.listen(PORT, ADDRESS, () => {
    console.log(`Server running on ${URL}:${PORT}`);
});

/// Commentare se non in produzione
//
// server.listen(PORT, '0.0.0.0', () => {
//     console.log(`Server running on ${URL}:${PORT}`);
// });
