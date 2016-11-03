var rekuire = require('rekuire');
var DrugBox = rekuire('models/DrugBox');
var Drug = rekuire('models/Drug');

var Promise = require('bluebird');
var DrugStockService = rekuire('services/DrugStockService');

var ErrorFactory = rekuire('utils/ErrorFactory');

var sanitizeDrugBoxInput = function(data, id) {
    if (!data.DrugId) {
        throw ErrorFactory.make('Box requires a drug reference', 400);
    }

    return {
        id : id,
        expiresAt : data.expiresAt,
        openedAt : data.openedAt,
        unitCount : parseInt(data.unitCount),
        brand : data.brand,
        productionNumber : data.productionNumber,
        properties : data.properties,
        DrugId : data.DrugId
    };
};

var DrugBoxService = function(context) {

    var getTransaction = context.getTransaction;

    return {
        getAllDrugBoxes : function() {
            return DrugBox.findAll({
                where : { PatientId : context.patient },
                include : [ { model : Drug, required : true } ],
                transaction : getTransaction()
            });
        },

        getDrugBox : function(id) {
            return DrugBox.find({
                where : { PatientId : context.patient, id : id },
                include : [ { model : Drug, required : true } ],
                transaction : getTransaction()
            }).then(function(drugBox) {
                if (!drugBox) { throw ErrorFactory.make('DrugBox not found', 404); }

                return drugBox;
            });
        },

        createDrugBox : function(data) {
            data = sanitizeDrugBoxInput(data);
            data.PatientId = context.patient;

            return DrugBox.create(data, { transaction : getTransaction() }).then((drugBox) => {
                return Promise.all([
                    this.getDrugBox(drugBox.get('id')),
                    new DrugStockService(context).updateStockFor(data.DrugId, data.unitCount, 'box ' + drugBox.get('id') + ' was added')
                ]);
            }).spread((drugBox) => {
                return drugBox;
            });
        },

        updateDrugBox : function(id, data) {
            data = sanitizeDrugBoxInput(data, id);
            data.PatientId = context.patient;

            return this.getDrugBox(id).then((currentDrugBox) => {
                var unitDiff = data.unitCount - currentDrugBox.get('unitCount');

                return Promise.all([
                    DrugBox.update(data, { where : { PatientId : context.patient, id : id }, transaction : getTransaction() }),
                    new DrugStockService(context).updateStockFor(data.DrugId, unitDiff, 'box ' + id + ' was updated')
                ]);
            }).then(() => {
                return this.getDrugBox(id);
            }); // TODO: update returns array of changed rows
        },

        deleteDrugBox : function(id) {
            return this.getDrugBox(id).then((currentDrugBox) => {
                var unitDiff = -currentDrugBox.get('unitCount');

                return Promise.all([
                    DrugBox.destroy({ where : { PatientId : context.patient, id : id }, transaction : getTransaction() }),
                    new DrugStockService(context).updateStockFor(currentDrugBox.get('DrugId'), unitDiff, 'box ' + id + ' was removed')
                ]);
            });
        }
    };

};

module.exports = DrugBoxService;
