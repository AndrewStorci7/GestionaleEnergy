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

const app = express();
const PORT = process.env.NEXT_PUBLIC_APP_SERVER_PORT;
const URL = process.env.NEXT_PUBLIC_APP_SERVER_URL;

// Middleware to parse in JSON
app.use(express.json());
// Allow CORS
app.use(cors());

app.use(loginRouter(db));

app.use(presserRoute(db));
app.use(wheelmanRoute(db));
app.use(totalBaleRoute(db));
app.use(plasticRoute(db));
app.use(cdbpRoute(db));
app.use(cdbcRoute(db));
app.use(warehouseRoute(db));
app.use(reiRoute(db));
app.use(selectedBaleRoute(db));
app.use(reasonRouter(db));
app.use(implantRouter(db));

app.listen(PORT, () => {
    console.log(`Server running on ${URL}:${PORT}`);
});
