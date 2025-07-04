// monitoring.js
import Console from './console.js';

const console = new Console("Monitoring", 1);

class Monitoring {
    constructor(db) {
        // console = console;
        this.db = db;
    }

    logRequest(req) {
        console.info(`Richiesta: ${req.method} ${req.url}`);
        console.debug(`Headers: ${JSON.stringify(req.headers)}`);
        if (req.body) {
            console.debug(`Body: ${JSON.stringify(req.body)}`);
        }
    }

    logResponse(res) {
        console.info(`Risposta: ${res.statusCode}`);
    }


    /**
     * Middleware per monitorare le performance delle richieste
     */
    performanceMonitor = (req, res, next) => {
        const start = Date.now();
        const originalSend = res.send;
        
        res.send = function(data) {
            const duration = Date.now() - start;
            
            // Log richieste lente (oltre 5 secondi)
            if (duration > 5000) {
                console.error(`RICHIESTA LENTA: ${req.method} ${req.url} - ${duration}ms`);
            }
            
            // Log richieste molto lente (oltre 10 secondi)
            if (duration > 10000) {
                console.error(`RICHIESTA CRITICA: ${req.method} ${req.url} - ${duration}ms`);
                console.error(`Headers: ${JSON.stringify(req.headers)}`);
                console.error(`Body: ${JSON.stringify(req.body)}`);
            }
            
            originalSend.call(this, data);
        };
        
        next();
    };

    /**
     * Middleware per gestire gli errori non catturati
     */
    errorHandler = (err, req, res, next) => {
        console.error(`ERRORE NON GESTITO: ${err.message}`);
        console.error(`Stack: ${err.stack}`);
        console.error(`URL: ${req.method} ${req.url}`);
        console.error(`Body: ${JSON.stringify(req.body)}`);
        
        if (res.headersSent) {
            return next(err);
        }
        
        res.status(500).json({
            code: 1,
            message: 'Errore interno del server',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    };

    /**
     * Middleware per timeout delle richieste
     */
    requestTimeout = (timeout = 30000) => {
        return (req, res, next) => {
            res.setTimeout(timeout, () => {
                console.error(`TIMEOUT: ${req.method} ${req.url} - ${timeout}ms`);
                if (!res.headersSent) {
                    res.status(408).json({
                        code: 1,
                        message: 'Timeout della richiesta'
                    });
                }
            });
            next();
        };
    };

    /**
     * Middleware per limitare il numero di richieste concorrenti
     */
    concurrencyLimiter = (maxConcurrent = 50) => {
        let currentRequests = 0;
        
        return (req, res, next) => {
            if (currentRequests >= maxConcurrent) {
                return res.status(503).json({
                    code: 1,
                    message: 'Server sovraccarico, riprova più tardi'
                });
            }
            
            currentRequests++;
            
            const cleanup = () => {
                currentRequests--;
            };
            
            res.on('finish', cleanup);
            res.on('close', cleanup);
            res.on('error', cleanup);
            
            next();
        };
    };

    /**
     * Health check endpoint
     */
    healthCheck = async (req, res) => {
        try {

            const dbTest = await this.db.testConnection();
            
            const health = {
                status: 'ok',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                database: dbTest ? 'connected' : 'disconnected'
            };
            
            res.json(health);
        } catch (error) {
            console.error('Health check failed:', error);
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    };
}

export default Monitoring;