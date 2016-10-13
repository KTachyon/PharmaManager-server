var rekuire = require('rekuire');
var DrugStockService = rekuire('services/DrugStockService');
var DrugStockMapper = rekuire('mappers/DrugStockMapper');

var DrugStockMiddleware = function() {

    return {
        getDrugStock: function(request) {
            return new DrugStockService(request.context).getAllDrugStock().then(function(drugStock) {
                return DrugStockMapper.map(drugStock);
            });
        }
    };

};

module.exports = new DrugStockMiddleware();
