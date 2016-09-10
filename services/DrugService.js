var rekuire = require('rekuire');
var Drug = rekuire('models/Drug');

var ErrorFactory = rekuire('utils/ErrorFactory');

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

        searchDrug : function(searchTerms) {
            // TODO: https://www.postgresql.org/docs/9.1/static/fuzzystrmatch.html
        },

        createDrug : function(data) {
            return Drug.create(data, { transaction : getTransaction() });
        },

        updateDrug : function(id, data) {
            return Drug.update(data, { where : { id : id }, transaction : getTransaction() });
        },

        deleteDrug : function(id) {
            return Drug.destroy({ where : { id : id }, transaction : getTransaction() });
        }
    };

};

module.exports = DrugService;
