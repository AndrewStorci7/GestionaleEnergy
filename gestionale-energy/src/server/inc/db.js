// Configuring .env file
import dotenv from 'dotenv';
const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
dotenv.config({ path: envFile });

// const mysql = require('mysql2');
import mysql from 'mysql2';
// const Console = require('./console');
import Console from './console.js';

const console = new Console("Database", 1);

const DB_HOST = process.env.NEXT_PUBLIC_APP_DB_HOST;
const DB_PORT = process.env.NEXT_PUBLIC_APP_DB_PORT;
const DB_NAME = process.env.NEXT_PUBLIC_APP_DB_NAME;
const DB_USER = process.env.NEXT_PUBLIC_APP_DB_USERNAME;
const DB_PW = process.env.NEXT_PUBLIC_APP_DB_PASSWORD;

const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PW,
    database: DB_NAME,
    port: DB_PORT,
    timezone: "Europe/Rome"
});

const promisePool = pool.promise();

const originalPromiseQuery = promisePool.query.bind(promisePool);
promisePool.query = (...args) => {
    const debug = typeof args[args.length - 1] === 'boolean' ? args.pop() : false;
    const [sql, params] = args;

    // if (debug) {
    //     console.debug(`\n[QUERY] ${sql}`);
    //     if (params) console.debug(`[PARAMS] ${JSON.stringify(params)}`);
    // }

    return originalPromiseQuery(sql, params);
};

const originalPromiseExecute = promisePool.execute.bind(promisePool);
promisePool.execute = (...args) => {
    const debug = typeof args[args.length - 1] === 'boolean' ? args.pop() : false;
    const [sql, params] = args;

    // if (debug) {
    //     console.debug(`\n[EXECUTE] ${sql}`);
    //     if (params) console.debug(`[PARAMS] ${JSON.stringify(params)}`);
    // }

    return originalPromiseExecute(sql, params);
};

export default promisePool;