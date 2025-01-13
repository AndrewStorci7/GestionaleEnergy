const express = require('express');
const Controller = require('../controllers/wheelman');

module.exports = (db, table) => {
    const router = express.Router();
    const controller = new Controller(db, table);

    router.post('/wheelman', (req, res) => controller.get(req, res));
    router.post('/uwheelmanbale', (req, res) => controller.update(req, res));

    return router;
}