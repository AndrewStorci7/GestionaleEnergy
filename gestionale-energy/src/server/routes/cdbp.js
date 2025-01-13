const express = require('express');
const Controller = require('../controllers/cdbp');

module.exports = (db, table) => {
    const router = express.Router();
    const controller = new Controller(db, table);

    router.get('/cdbp', (req, res) => controller.get(req, res));

    return router;
}