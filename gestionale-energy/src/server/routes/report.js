import express from 'express';
import Controller from '../controllers/report.js';

export default (db, queue,  table) => {
    const router = express.Router();
    const controller = new Controller(db, queue,  table);

    router.post('/report', (req, res) => controller.reportGiornaliero(req, res));
    router.post('/tot-balle', (req, res) => controller.balleTotaliComplessive(req, res));
    router.post('/contatori', (req, res) => controller.reportContatori(req, res));
    router.post('/report-plast', (req, res) => controller.reportDinamico(req, res));
    return router;
}