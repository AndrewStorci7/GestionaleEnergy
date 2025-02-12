import express from 'express';
import Controller from '../controllers/wheelman.js';

export default (db, queue,  table) => {
    const router = express.Router();
    const controller = new Controller(db, queue,  table);

    router.post('/wheelman', (req, res) => controller.get(req, res));
    router.post('/uwheelmanbale', (req, res) => controller.update(req, res));
    router.post('/wheelman/set', (req, res) => controller.set(req, res));

    return router;
}