import express from 'express';
import Controller from '../controllers/total-bale.js';

export default (db, queue,  table) => {
    const router = express.Router();
    const controller = new Controller(db, queue,  table);

    // Add a new bale
    router.post('/add-bale', (req, res) => controller.add(req, res));

    // Delete bale
    router.post('/delete-bale', (req, res) => controller.delete(req, res));

    router.post('/update-status', (req, res) => controller.updateStatusTotalBale(req, res));
    // Conteggio Balle Totali in tempo reale
    router.post('/balle-totali', (req, res) => controller.balleTotali(req, res));
    // Prendi Balla dal ID Impianto
    router.post('/id-bale', (req,res) => controller.getByImplantId(req, res));
    // TEST converisone stringhe
    router.post('/injection', (req, res) => controller.prova(req, res));

    router.post('/bale', (req, res) => controller.get(req, res));
    
    return router;
}