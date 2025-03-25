// Configuring .env file
import dotenv from 'dotenv';
const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
dotenv.config({ path: envFile });

// const mysql = require('mysql2');
import mysql from 'mysql2';
// const Console = require('./console');
import Console from './console.js';

const console = new Console("Database");

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
});

const originalQuery = pool.query.bind(pool);
pool.query = (sql, params, callback) => {
    console.info(`\n[QUERY] ${sql}`);
    if (params) console.info(`\n[PARAMS] ${JSON.stringify(params)}`);
    return originalQuery(sql, params, callback);
};

const originalExecute = pool.execute.bind(pool);
pool.execute = (sql, params, callback) => {
    console.info(`\n[EXECUTE] ${sql}`);
    if (params) console.info(`\n[PARAMS] ${JSON.stringify(params)}`);
    return originalExecute(sql, params, callback);
};

export default pool.promise();