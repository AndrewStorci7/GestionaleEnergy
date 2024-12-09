const express = require('express');
const PlasticController = require('../controllers/plastic');

module.exports = (db) => {
    const router = express.Router();
    const plasticCtrl = new PlasticController(db);

    router.get('/plastic', (req, res) => plasticCtrl.get(req, res));

    return router;
}