const express = require('express');
const Controller = require('../controllers/implant');

module.exports = (db) => {
    const router = express.Router();
    const controller = new Controller(db);

    router.get('/implants', (req, res) => controller.get(req, res));

    return router;
}