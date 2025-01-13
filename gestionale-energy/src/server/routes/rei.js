const express = require('express');
const Controller = require('../controllers/rei');

module.exports = (db, table) => {
    const router = express.Router();
    const controller = new Controller(db, table);

    router.get('/rei', (req, res) => controller.get(req, res));

    return router;
}