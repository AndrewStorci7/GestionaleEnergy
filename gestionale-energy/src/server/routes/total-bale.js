const express = require('express');
const TotalBaleController = require('../controllers/total-bale');

module.exports = (db) => {
    const router = express.Router();
    const totalBaleController = new TotalBaleController(db);

    router.post('/add-bale', (req, res) => totalBaleController.add(req, res));

    return router;
}