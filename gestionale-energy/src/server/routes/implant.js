import express from 'express';
import Controller from '../controllers/implant.js';

export default (db, table) => {
    const router = express.Router();
    const controller = new Controller(db, table);

    router.get('/implants/get', (req, res) => controller.get(req, res));

    return router;
}