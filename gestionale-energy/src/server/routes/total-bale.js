const express = require('express');
const TotalBaleController = require('../controllers/total-bale');

module.exports = (db) => {
    const router = express.Router();
    const totalBaleController = new TotalBaleController(db);

    // Add a new bale
    router.post('/add-bale', (req, res) => totalBaleController.add(req, res));
    // Get all bale of presser
    router.post('/p-bale', (req, res) => totalBaleController.getAllPresserBale(req, res));
    // Get all bale of wheelman
    router.post('/w-bale', (req, res) => totalBaleController.getAllWheelmanBale(req, res));
    // Get all bale from a search or a filter
    // router.post('/s-bale', (req, res) => totalBaleController.get(req, res));

    // TEST converisone stringhe
    router.post('/injection', (req, res) => totalBaleController.prova(req, res)) 

    // TEST
    router.post('/bale', (req, res) => totalBaleController.get(req, res));
    return router;
}