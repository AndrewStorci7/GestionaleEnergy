const express = require('express');
const SelectedBaleController = require('../controllers/selected-bale');

module.exports = (db) => {
    const router = express.Router();
    const selectedBaleCtrl = new SelectedBaleController(db);

    router.get('/selected-b', (req, res) => selectedBaleCtrl.get(req, res));

    return router;
}