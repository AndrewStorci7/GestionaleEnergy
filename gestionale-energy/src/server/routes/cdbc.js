const express = require('express');
const Controller = require('../controllers/cdbc');

module.exports = (db, table) => {
    const router = express.Router();
    const controller = new Controller(db, table);

    router.get('/cdbc', (req, res) => controller.get(req, res));

    return router;
}