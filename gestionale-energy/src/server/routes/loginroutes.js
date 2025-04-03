import express from 'express';
import Controller from '../controllers/login.js';

export default (db, table) => {
    const router = express.Router();
    const controller = new Controller(db, table);

    router.post('/login', (req, res) => controller.check(req, res));

    return router;
}