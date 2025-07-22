import dotenv from 'dotenv';
import mysql from 'mysql2';
import Console from './console.js';

const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
dotenv.config({ path: envFile });

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
    timezone: "Europe/Rome",
    
    // CONFIGURAZIONI OTTIMIZZATE
    connectionLimit: 50,              // Ridotto da 100 - più gestibile
    acquireTimeout: 30000,            // 30 secondi timeout acquisizione
    timeout: 30000,                   // 30 secondi timeout query
    idleTimeout: 600000,              // 10 minuti timeout idle
    reconnect: true,                  // Riconnessione automatica
    multipleStatements: false,        // Sicurezza
    
    // NUOVE CONFIGURAZIONI CRITICHE
    queueLimit: 0,                    // Nessun limite coda
    removeNodeErrorCount: 5,          // Rimuovi nodo dopo 5 errori
    restoreNodeTimeout: 30000,        // Prova a ripristinare dopo 30s
    
    // GESTIONE CONNESSIONI
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    
    // CONFIGURAZIONI SSL (se necessario)
    ssl: false,
    
    // CHARSET
    charset: 'utf8mb4',
    
    // GESTIONE ERRORI
    typeCast: function (field, next) {
        if (field.type === 'TINY' && field.length === 1) {
            return (field.string() === '1');
        }
        return next();
    }
});

// GESTIONE EVENTI DEL POOL
pool.on('connection', function (connection) {
    // console.info(`Nuova connessione stabilita: ${connection.threadId}`);
    console.debug(`Nuova connessione stabilita: ${connection.threadId}`);
});

pool.on('error', function(err) {
    console.error('Errore del pool database:', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Connessione al database persa, tentativo di riconnessione...');
    }
});

pool.on('acquire', function (connection) {
    console.debug(`Connessione ${connection.threadId} acquisita`);
});

pool.on('release', function (connection) {
    console.debug(`Connessione ${connection.threadId} rilasciata`);
});

pool.on('enqueue', function () {
    console.debug('In attesa di una connessione disponibile');
});

const promisePool = pool.promise();

// OVERRIDE MIGLIORATO PER QUERY
const originalPromiseQuery = promisePool.query.bind(promisePool);
promisePool.query = (...args) => {
    const debug = typeof args[args.length - 1] === 'boolean' ? args.pop() : false;
    const [sql, params] = args;

    if (debug) {
        console.debug(`\n[QUERY] ${sql}`);
        if (params) console.debug(`[PARAMS] ${JSON.stringify(params)}`);
    }

    // TIMEOUT PERSONALIZZATO PER LA QUERY
    return Promise.race([
        originalPromiseQuery(sql, params),
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Query timeout dopo 30 secondi')), 30000)
        )
    ]);
};

// OVERRIDE MIGLIORATO PER EXECUTE
const originalPromiseExecute = promisePool.execute.bind(promisePool);
promisePool.execute = (...args) => {
    const debug = typeof args[args.length - 1] === 'boolean' ? args.pop() : false;
    const [sql, params] = args;

    if (debug) {
        console.debug(`\n[EXECUTE] ${sql}`);
        if (params) console.debug(`[PARAMS] ${JSON.stringify(params)}`);
    }

    return Promise.race([
        originalPromiseExecute(sql, params),
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Execute timeout dopo 30 secondi')), 30000)
        )
    ]);
};

// FUNZIONE PER TESTARE LA CONNESSIONE
promisePool.testConnection = async function() {
    try {
        const [rows] = await this.query('SELECT 1 as test');
        console.debug('Test connessione database: OK');
        return true;
    } catch (error) {
        console.error('Test connessione database: FALLITO', error);
        return false;
    }
};

// GRACEFUL SHUTDOWN
process.on('SIGINT', () => {
    console.info('Chiusura del pool database...');
    pool.end(() => {
        console.info('Pool database chiuso.');
        process.exit(0);
    });
});

export default promisePool;

// // Configuring .env file
// import dotenv from 'dotenv';
// const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
// dotenv.config({ path: envFile });

// // const mysql = require('mysql2');
// import mysql from 'mysql2';
// // const Console = require('./console');
// import Console from './console.js';

// const console = new Console("Database", 1);

// const DB_HOST = process.env.NEXT_PUBLIC_APP_DB_HOST;
// const DB_PORT = process.env.NEXT_PUBLIC_APP_DB_PORT;
// const DB_NAME = process.env.NEXT_PUBLIC_APP_DB_NAME;
// const DB_USER = process.env.NEXT_PUBLIC_APP_DB_USERNAME;
// const DB_PW = process.env.NEXT_PUBLIC_APP_DB_PASSWORD;

// const pool = mysql.createPool({
//     host: DB_HOST,
//     user: DB_USER,
//     password: DB_PW,
//     database: DB_NAME,
//     port: DB_PORT,
//     timezone: 'Europe/Rome',
//     // Configurazioni del pool per evitare sovraccarico
//     connectionLimit: 100,          // Max connessioni simultanee
//     // acquireTimeout: 60000,         // Timeout acquisizione connessione (60s)
//     // timeout: 60000,                // Timeout query (60s)
//     // idleTimeout: 300000,           // Timeout connessioni idle (5min)
//     // reconnect: true,               // Riconnessione automatica
//     multipleStatements: false,     // Sicurezza
//     // Gestione degli errori di connessione
//     // handleDisconnects: true,
//     // Pool eventi per debug
//     enableKeepAlive: true,
//     keepAliveInitialDelay: 0
// });

// const promisePool = pool.promise();

// const originalPromiseQuery = promisePool.query.bind(promisePool);
// promisePool.query = (...args) => {
//     const debug = typeof args[args.length - 1] === 'boolean' ? args.pop() : false;
//     const [sql, params] = args;

//     if (debug) {
//         console.debug(`\n[QUERY] ${sql}`);
//         if (params) console.debug(`[PARAMS] ${JSON.stringify(params)}`);
//     }

//     return originalPromiseQuery(sql, params);
// };

// const originalPromiseExecute = promisePool.execute.bind(promisePool);
// promisePool.execute = (...args) => {
//     const debug = typeof args[args.length - 1] === 'boolean' ? args.pop() : false;
//     const [sql, params] = args;

//     if (debug) {
//         console.debug(`\n[EXECUTE] ${sql}`);
//         if (params) console.debug(`[PARAMS] ${JSON.stringify(params)}`);
//     }

//     return originalPromiseExecute(sql, params);
// };

// export default promisePool;