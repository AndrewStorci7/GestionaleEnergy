const express = require('express');
const Controller = require('../controllers/warehouse');

module.exports = (db, table) => {
    const router = express.Router();
    const controller = new Controller(db, table);

    router.get('/dest-wh', (req, res) => controller.get(req, res));

    return router;
}