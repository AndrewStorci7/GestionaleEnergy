const express = require('express');
const WheelmanController = require('../controllers/wheelman');

module.exports = (db) => {
    const router = express.Router();
    const wheelmanCtrl = new WheelmanController(db);

    router.post('/wheelman', (req, res) => wheelmanCtrl.getWheelmanBale(req, res));

    return router;
}