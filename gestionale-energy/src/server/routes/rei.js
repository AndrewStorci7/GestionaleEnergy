import express from 'express';
import Controller from '../controllers/rei.js';

export default (db, table) => {
    const router = express.Router();
    const controller = new Controller(db, table);

    router.get('/rei/get', (req, res) => controller.get(req, res));

    return router;
}