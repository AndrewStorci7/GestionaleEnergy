const express = require('express');
const Controller = require('../controllers/reason');

module.exports = (db) => {
    const router = express.Router();
    const controller = new Controller(db);

    router.get('/reason', (req, res) => controller.get(req, res));

    return router;
}