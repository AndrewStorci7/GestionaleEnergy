import express from 'express';
import Controller from '../controllers/presser.js';

export default (db, table) => {
    const router = express.Router();
    const controller = new Controller(db, table);

    router.post('/presser/get', (req, res) => controller.get(req, res));
    router.post('/presser/update', (req, res) => controller.update(req, res));
    router.post('/presser/set', (req, res) => controller.set(req, res));

    return router;
}