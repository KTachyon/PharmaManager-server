var rekuire = require('rekuire');
var DrugStockService = rekuire('services/DrugStockService');
var DrugStockMapper = rekuire('mappers/DrugStockMapper');

var DrugStockMiddleware = function() {

    return {
        getDrugStock: function(request) {
            return new DrugStockService(request.context).getAllDrugStock().then(function(drugStock) {
                return DrugStockMapper.map(drugStock);
            });
        },

        getStockReport: function(request) {
            return new DrugStockService(request.context).getStockReport();
        },

        weeklyStockUpdate : function(request) {
            return new DrugStockService(request.context).weeklyStockUpdate();
        },

        manualStockUpdate : function(request) {
            return new DrugStockService(request.context).updateStockFor(request.body.DrugId, request.body.amount, 'manual stock update');
        }
    };

};

module.exports = new DrugStockMiddleware();
