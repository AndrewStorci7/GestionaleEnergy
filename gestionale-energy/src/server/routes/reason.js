import express from 'express';
import Controller from '../controllers/reason.js';

export default (db, queue,  table) => {
    const router = express.Router();
    const controller = new Controller(db, queue,  table);

    router.get('/reason', (req, res) => controller.get(req, res));

    return router;
}