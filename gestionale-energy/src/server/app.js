/**
 * Express App Configuration
 * 
 * @author Andrea Storci from Oppimittinetworking
 */

// Configuring .env file
import dotenv from 'dotenv';
dotenv.config();

// import express from 'express';
import express from 'express';
// const cors = require('cors');
import cors from 'cors';
// const db = require('./inc/db');
import db from './inc/db.js';
// const WebSocket = require('ws');
import WebSocket, { WebSocketServer } from 'ws';
// const PQueue = require("p-queue").default;
import PQueue from 'p-queue';
// const WebSocketApp = require('./ws/ws');
import WebSocketApp from './ws/ws.js';
// const server = require('http').createServer(app);
import { createServer } from 'http';


// const presserRoute = require('./routes/presser');
import presserRoute from './routes/presser.js';
// const wheelmanRoute = require('./routes/wheelman');
import wheelmanRoute from './routes/wheelman.js';
// const totalBaleRoute = require('./routes/total-bale');
import totalBaleRoute from './routes/total-bale.js';
// const plasticRoute = require('./routes/plastic');
import plasticRoute from './routes/plastic.js';
// const cdbpRoute = require('./routes/cdbp');
import cdbpRoute from './routes/cdbp.js';
// const cdbcRoute = require('./routes/cdbc');
import cdbcRoute from './routes/cdbc.js';
// const warehouseRoute = require('./routes/warehouse');
import warehouseRoute from './routes/warehouse.js';
// const reiRoute = require('./routes/rei');
import reiRoute from './routes/rei.js';
// const selectedBaleRoute = require('./routes/selected-bale');
import selectedBaleRoute from './routes/selected-bale.js';
// const reasonRouter = require('./routes/reason');
import reasonRouter from './routes/reason.js';
// const implantRouter = require('./routes/implant');
import implantRouter from './routes/implant.js';
// const loginRouter = require('./routes/loginroutes');
import loginRouter from './routes/loginroutes.js';
// const reportRouter = require('./routes/report');
import reportRouter from './routes/report.js';

// Istanza app Express 
const app = express();
const ADDRESS = process.env.NEXT_PUBLIC_APP_ADDRESS_DEV;
const PORT = process.env.NEXT_PUBLIC_APP_SERVER_PORT;
const URL = process.env.NEXT_PUBLIC_APP_SERVER_URL;

// Middleware per fare il parse in JSON
app.use(express.json());
// Accetta CORS
app.use(cors());

// Istanza Server Web Socket
const server = createServer(app);
const wss = new WebSocketServer({ server });
const wsa = new WebSocketApp(wss);

// Coda di priorità
const queue = new PQueue({ concurrency: 2 });

wsa.onConnection();

app.use(loginRouter(db, queue));

app.use(presserRoute(db, queue, "presser_bale"));
app.use(wheelmanRoute(db, queue, "wheelman_bale"));
app.use(totalBaleRoute(db, queue, "pb_wb"));
app.use(plasticRoute(db, queue, "code_plastic"));
app.use(cdbpRoute(db, queue, "cond_presser_bale"));
app.use(cdbcRoute(db, queue, "cond_wheelman_bale"));
app.use(warehouseRoute(db, queue, "warehouse_dest"));
app.use(reiRoute(db, queue, "rei"));
app.use(selectedBaleRoute(db, queue, "selected_bale"));
app.use(reasonRouter(db, queue, "reas_not_tying"));
app.use(implantRouter(db, queue, "implants"));
app.use(reportRouter(db, queue));

server.listen(PORT, ADDRESS, () => {
    console.log(`Server running on ${URL}:${PORT}`);
});
