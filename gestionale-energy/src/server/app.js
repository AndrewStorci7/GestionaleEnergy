/**
 * Express App Configuration
 * 
 * @author Andrea Storci from Oppimittinetworking
 */

// Configuring .env file
import dotenv from 'dotenv';
import fs from 'fs';
const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
dotenv.config({ path: envFile });

import Console from './inc/console.js';
const console = new Console("MainApp", 3);
// Verifica se il file esiste
if (!fs.existsSync(envFile)) {
    console.error(`Il file ${envFile} non è stato trovato!`);
} else {
    console.info(`Caricando il file di configurazione: ${envFile}`);
}

import express from 'express';
import cors from 'cors';
import db from './inc/db.js';
import WebSocket, { WebSocketServer } from 'ws';
import WebSocketApp from './ws/ws.js';
import https from 'https';
import { createServer } from 'http';

import presserRoute from './routes/presser.js';
import wheelmanRoute from './routes/wheelman.js';
import totalBaleRoute from './routes/total-bale.js';
import plasticRoute from './routes/plastic.js';
import cdbpRoute from './routes/cdbp.js';
import cdbcRoute from './routes/cdbc.js';
import warehouseRoute from './routes/warehouse.js';
import reiRoute from './routes/rei.js';
import selectedBaleRoute from './routes/selected-bale.js';
import reasonRouter from './routes/reason.js';
import implantRouter from './routes/implant.js';
import loginRouter from './routes/loginroutes.js';
import reportRouter from './routes/report.js';

import Monitoring from './inc/monitoring.js';

// Istanza app Express 
const app = express();
const ADDRESS = process.env.NEXT_PUBLIC_APP_ADDRESS;
const PORT = process.env.NEXT_PUBLIC_APP_SERVER_PORT;
const URL = process.env.NEXT_PUBLIC_APP_SERVER_URL;
// const CERT_PATH = process.env.NEXT_PUBLIC_APP_CERT_PATH;
// const KEY_PATH = process.env.NEXT_PUBLIC_APP_KEY_PATH;
// const options = {
//     key: fs.readFileSync(KEY_PATH),
//     cert: fs.readFileSync(CERT_PATH)
// };

// Middleware per fare il parse in JSON
app.use(express.json());
// Accetta CORS
app.use(cors());

// Istanza Server Web Socket
// const server = https.createServer(options, app); // Test https
const server = createServer(app);
const wss = new WebSocketServer({ server });
const wsa = new WebSocketApp(wss);
const monitoring = new Monitoring(db);

wsa.onConnection();

app.use(loginRouter(db));

// app.use(Monitoring(db));
// HEALTH CHECK ENDPOINT
app.get('/health', monitoring.healthCheck);

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
    console.info(`Server running on ${URL}:${PORT}`);
    console.info(`DB MySQL running on ${process.env.NEXT_PUBLIC_APP_DB_HOST}:${process.env.NEXT_PUBLIC_APP_DB_PORT}`)
});
