var express = require('express');
var DrugBoxesRouter = express.Router();

var rekuire = require('rekuire');
var Transactional = rekuire('middleware/Transactional');
var DrugBoxMiddleware = rekuire('middleware/drugBoxes');

DrugBoxesRouter.get('/', Transactional(DrugBoxMiddleware.getDrugBoxes));
DrugBoxesRouter.put('/:id', Transactional(DrugBoxMiddleware.updateDrugBox));
DrugBoxesRouter.post('/', Transactional(DrugBoxMiddleware.createDrugBox));
DrugBoxesRouter.delete('/:id', Transactional(DrugBoxMiddleware.deleteDrugBox));

module.exports = DrugBoxesRouter;
