import express from 'express';
import Controller from '../controllers/total-bale.js';

export default (db, table) => {
    const router = express.Router();
    const controller = new Controller(db, table);

    // Add a new bale
    router.post('/bale/add', (req, res) => controller.add(req, res));

    // Delete bale
    router.post('/bale/delete', (req, res) => controller.delete(req, res));

    // Update status of a bale
    router.post('/bale/status/update', (req, res) => controller.updateStatusTotalBale(req, res));

    // Get every ID of the total bale: `id Presser Bale`, `id Wheelman Bale` and `Id Unique`
    router.post('/bale/ids', (req, res) => controller.getIdsBale(req, res));

    // Conteggio Balle Totali in tempo reale
    router.post('/bale/total-count', (req, res) => controller.balleTotali(req, res));

    // Conteggio Balle Totali in tempo reale
    router.post('/bale/total-chili', (req, res) => controller.totaleChili(req, res));

    // Get ID bale
    router.post('/bale/id', (req,res) => controller.getByImplantId(req, res));
    
    // Get a bale
    router.post('/bale/get', (req, res) => controller.get(req, res));
    
    return router;
}