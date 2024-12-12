const express = require('express');
const ConditionPresserBaleController = require('../controllers/cdbp');

module.exports = (db) => {
    const router = express.Router();
    const cdbpCtrl = new ConditionPresserBaleController(db);

    router.get('/cdbp', (req, res) => cdbpCtrl.get(req, res));

    return router;
}