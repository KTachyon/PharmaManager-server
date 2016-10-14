var rekuire = require('rekuire');
var Drug = rekuire('models/Drug');

var ErrorFactory = rekuire('utils/ErrorFactory');

var sanitizeDrugInput = function(data, id) {
    return {
        id : id,
        name : data.name,
        dose : parseFloat(data.dose),
        unit : data.unit,
        properties : data.properties
    };
};

var DrugService = function(context) {

    var getTransaction = context.getTransaction;

    return {
        getAllDrugs : function() {
            return Drug.findAll({ transaction : getTransaction() });
        },

        getDrug : function(id) {
            return Drug.findById(id, { transaction : getTransaction() }).then(function(drug) {
                if (!drug) { throw ErrorFactory.make('Drug not found', 404); }

                return drug;
            });
        },

        searchDrugs : function(searchTerms) {
            return Drug.search(searchTerms, getTransaction());
        },

        createDrug : function(data) {
            return Drug.create(sanitizeDrugInput(data), { transaction : getTransaction() });
        },

        updateDrug : function(id, data) {
            data = sanitizeDrugInput(data, id);

            return Drug.update(data, { where : { id : id }, transaction : getTransaction() }).then(() => {
                return this.getDrug(id);
            }); // TODO: update returns array of changed rows
        },

        deleteDrug : function(id) {
            return Drug.destroy({ where : { id : id }, transaction : getTransaction() });  // TODO: update returns deleted rows
        }
    };

};

module.exports = DrugService;
