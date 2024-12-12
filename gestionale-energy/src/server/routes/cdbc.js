const express = require('express');
const ConditionWheelmanBaleController = require('../controllers/cdbc');

module.exports = (db) => {
    const router = express.Router();
    const cdbcCtrl = new ConditionWheelmanBaleController(db);

    router.get('/cdbp', (req, res) => cdbcCtrl.get(req, res));

    return router;
}