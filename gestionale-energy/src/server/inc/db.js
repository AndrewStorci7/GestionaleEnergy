// Configuring .env file
require('dotenv').config();

const mysql = require('mysql2');

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

module.exports = pool.promise();