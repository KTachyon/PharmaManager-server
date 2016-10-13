var express = require('express');
var DrugStockRouter = express.Router();

var rekuire = require('rekuire');
var Transactional = rekuire('middleware/Transactional');
var DrugStockMiddleware = rekuire('middleware/drugStock');

DrugStockRouter.get('/', Transactional(DrugStockMiddleware.getDrugStock));

module.exports = DrugStockRouter;
