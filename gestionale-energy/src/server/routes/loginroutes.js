const express = require('express');
const Controller = require('../controllers/login');

module.exports = (db) => {
    const router = express.Router();
    const controller = new Controller(db);

    router.post('/login', (req, res) => controller.check(req, res));

    return router;
}