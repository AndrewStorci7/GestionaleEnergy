const express = require('express');
const Controller = require('../controllers/selected-bale');

module.exports = (db, table) => {
    const router = express.Router();
    const controller = new Controller(db, table);

    router.get('/selected-b', (req, res) => controller.get(req, res));

    return router;
}