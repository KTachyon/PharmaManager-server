var express = require('express');
var DrugStockRouter = express.Router();

var rekuire = require('rekuire');
var Transactional = rekuire('middleware/Transactional');
var DrugStockMiddleware = rekuire('middleware/drugStock');

function needsPatientContext(boolean, middlewareFn) {
    return function(request, response, next) {
        if ((request.context.patient && boolean) || !(request.context.patient || boolean)) {
            return middlewareFn(request, response, next);
        }

        return next();
    };
}

DrugStockRouter.get('/', needsPatientContext(true, Transactional(DrugStockMiddleware.getDrugStock)));
DrugStockRouter.put('/manualUpdate', needsPatientContext(true, Transactional(DrugStockMiddleware.manualStockUpdate)));

DrugStockRouter.get('/report', needsPatientContext(false, Transactional(DrugStockMiddleware.getStockReport)));
DrugStockRouter.post('/weekly', needsPatientContext(false, Transactional(DrugStockMiddleware.weeklyStockUpdate)));

module.exports = DrugStockRouter;
