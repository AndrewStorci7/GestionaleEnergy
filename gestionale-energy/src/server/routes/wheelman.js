import express from 'express';
import Controller from '../controllers/wheelman.js';

export default (db, table) => {
    const router = express.Router();
    const controller = new Controller(db, table);

    router.post('/wheelman/get', (req, res) => controller.get(req, res));

    router.post('/wheelman/update', (req, res) => controller.update(req, res));
    
    // router.post('/wheelman/set', (req, res) => controller.set(req, res));

    return router;
}