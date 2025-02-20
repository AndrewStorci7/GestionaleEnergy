import express from 'express';
import Controller from '../controllers/reason.js';

export default (db, table) => {
    const router = express.Router();
    const controller = new Controller(db, table);

    router.get('/reason/get', (req, res) => controller.get(req, res));

    return router;
}