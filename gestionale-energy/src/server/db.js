// Configuring .env file
require('dotenv').config();

const mysql = require('mysql2');

const DB_HOST = process.env.REACT_APP_DATABASE_HOST || '127.0.0.1';
const DB_PORT = process.env.REACT_APP_DATABASE_PORT;
const DB_NAME = process.env.REACT_APP_DATABASE_NAME;
const DB_USER = process.env.REACT_APP_DATABASE_HOST;
const DB_PW = process.env.REACT_APP_DATABASE_HOST;

const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PW,
    database: DB_NAME,
    port: DB_PORT,
});

module.exports = pool.promise();