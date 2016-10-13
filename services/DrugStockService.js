var rekuire = require('rekuire');
var DrugStock = rekuire('models/DrugStock');
var Drug = rekuire('models/Drug');

var ErrorFactory = rekuire('utils/ErrorFactory');

var DrugStockService = function(context) {

    var getTransaction = context.getTransaction;

    return {
        getAllDrugStock : function() {
            return DrugStock.findAll({
                where : { PatientId : context.patient },
                include : [ { model : Drug, required : true } ],
                transaction : getTransaction()
            });
        },

        updateStockFor : function(patientID, drugID, amount) {
            return DrugStock.find({ where : { PatientId : patientID, DrugId : drugID } }).then((stock) => {
                if (stock) {
                    stock.set('unitCount', stock.get('unitCount') + amount);

                    if (stock.get('unitCount') < 0) {
                        throw ErrorFactory.make('There is no stock available to fulfill order (' + patientID + ', ' + drugID + ', ' + amount +')', 400);
                    }

                    return stock.save({ transaction : getTransaction() });
                }

                if (amount < 0) {
                    throw ErrorFactory.make('There is no stock available to fulfill order (' + patientID + ', ' + drugID + ', ' + amount +')', 400);
                }

                return DrugStock.create({
                    PatientId : patientID,
                    DrugId : drugID,
                    unitCount : amount
                });
            });
        }
    };

};

module.exports = DrugStockService;
