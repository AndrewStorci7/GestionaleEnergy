const express = require('express');
const Controller = require('../controllers/presser');

module.exports = (db) => {
    const router = express.Router();
    const controller = new Controller(db);

    router.post('/presser', (req, res) => controller.get(req, res));
    router.post('/upresserbale', (req, res) => controller.update(req, res));

    return router;
}