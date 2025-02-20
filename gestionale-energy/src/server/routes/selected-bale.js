import express from 'express';
import Controller from '../controllers/selected-bale.js';

export default (db, table) => {
    const router = express.Router();
    const controller = new Controller(db, table);

    router.get('/selected-b/get', (req, res) => controller.get(req, res));

    return router;
}