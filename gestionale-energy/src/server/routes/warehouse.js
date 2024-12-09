const express = require('express');
const WarehouseController = require('../controllers/warehouse');

module.exports = (db) => {
    const router = express.Router();
    const warehouseCtrl = new WarehouseController(db);

    router.get('/dest-wh', (req, res) => warehouseCtrl.get(req, res));

    return router;
}