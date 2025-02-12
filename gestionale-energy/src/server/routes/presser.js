import express from 'express';
import Controller from '../controllers/presser.js';

export default (db, queue, table) => {
    const router = express.Router();
    const controller = new Controller(db, queue, table);

    router.post('/presser', (req, res) => controller.get(req, res));
    router.post('/upresserbale', (req, res) => controller.update(req, res));
    router.post('/presser/set', (req, res) => controller.set(req, res));

    return router;
}