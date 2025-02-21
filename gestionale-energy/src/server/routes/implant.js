const express = require('express');
const Controller = require('../controllers/implant');

module.exports = (db, table) => {
    const router = express.Router();
    const controller = new Controller(db, table);

    router.get('/implants', (req, res) => controller.get(req, res));
    router.get('/implants/id', (req, res) => controller.getById(req, res));
    
    return router;
}