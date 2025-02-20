import express from 'express';
import Controller from '../controllers/report.js';

export default (db, table) => {
    const router = express.Router();
    const controller = new Controller(db, table);

    router.post('/report/daily', (req, res) => controller.reportGiornaliero(req, res));
    
    router.post('/report/total-bale', (req, res) => controller.balleTotaliComplessive(req, res));

    router.post('/report/contatori', (req, res) => controller.reportContatori(req, res));

    router.post('/report/dynamic', (req, res) => controller.reportDinamico(req, res));

    return router;
}