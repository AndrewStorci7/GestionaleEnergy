const express = require('express');
const ReiController = require('../controllers/rei');

module.exports = (db) => {
    const router = express.Router();
    const reiCtrl = new ReiController(db);

    router.get('/rei', (req, res) => reiCtrl.get(req, res));

    return router;
}