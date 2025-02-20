import express from 'express';
import Controller from '../controllers/warehouse.js';

export default (db, table) => {
    const router = express.Router();
    const controller = new Controller(db, table);

    router.get('/dest-wh/get', (req, res) => controller.get(req, res));

    return router;
}