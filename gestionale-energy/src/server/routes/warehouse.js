import express from 'express';
import Controller from '../controllers/warehouse.js';

export default (db, queue,  table) => {
    const router = express.Router();
    const controller = new Controller(db, queue,  table);

    router.get('/dest-wh', (req, res) => controller.get(req, res));

    return router;
}