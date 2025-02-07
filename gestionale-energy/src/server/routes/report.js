const express = require('express');
const Controller = require('../controllers/report');

module.exports = (db, table) => {
    const router = express.Router();
    const controller = new Controller(db, table);

    router.post('/report', (req, res) => controller.reportGiornaliero(req, res));
    router.post('/tot-balle', (req, res) => controller.balleTotaliComplessive(req, res));
    router.post('/contatori', (req, res) => controller.reportContatori(req, res));
    router.post('/report-plast', (req, res) => controller.reportDinamico(req, res));
    return router;
}