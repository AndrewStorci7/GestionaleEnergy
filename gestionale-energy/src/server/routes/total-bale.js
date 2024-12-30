const express = require('express');
const Controller = require('../controllers/total-bale');

module.exports = (db, table) => {
    const router = express.Router();
    const controller = new Controller(db, table);

    // Add a new bale
    router.post('/add-bale', (req, res) => controller.add(req, res));

    // Deelte bale
    router.post('/delete-bale', (req, res) => controller.delete(req, res))

    // Get all bale of presser
    // router.post('/p-bale', (req, res) => controller.getAllPresserBale(req, res));
    // Get all bale of wheelman
    // router.post('/w-bale', (req, res) => controller.getAllWheelmanBale(req, res));
    // Get all bale from a search or a filter
    // router.post('/s-bale', (req, res) => controller.get(req, res));
    
    // Prendi Balla dal ID Impianto
    router.post('/id-bale', (req,res) => controller.getByImplantId(req, res));
    // TEST converisone stringhe
    router.post('/injection', (req, res) => controller.prova(req, res))

    router.post('/bale', (req, res) => controller.get(req, res));
    
    return router;
}