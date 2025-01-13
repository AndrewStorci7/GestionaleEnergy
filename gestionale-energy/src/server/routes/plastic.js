const express = require('express');
const Controller = require('../controllers/plastic');

module.exports = (db, table) => {
    const router = express.Router();
    const controller = new Controller(db, table);

    router.get('/plastic', (req, res) => controller.get(req, res));

    return router;
}