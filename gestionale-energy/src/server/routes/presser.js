const express = require('express');
const PresserController = require('../controllers/presser');

module.exports = (db) => {
    const router = express.Router();
    const presserCtrl = new PresserController(db);

    router.post('/presser', (req, res) => presserCtrl.getPresserBale(req, res));

    return router;
}