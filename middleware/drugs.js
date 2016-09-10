var rekuire = require('rekuire');
var DrugService = rekuire('services/DrugService');
var DrugMapper = rekuire('mappers/DrugMapper');

var DrugsMiddleware = function() {

    return {
        getAllDrugs : function(request) {
        	return new DrugService(request.context).getAllDrugs().then(function(drugs) {
        		return DrugMapper.map(drugs);
        	});
        },

        getDrug : function(request) {
            return new DrugService(request.context).getDrug(request.params.id).then(function(drug) {
        		return DrugMapper.map(drug);
        	});
        },

        createDrug : function(request) {
            return new DrugService(request.context).createDrug(request.body).then(function(drug) {
                return DrugMapper.map(drug);
            });
        },

        updateDrug : function(request) {
            return new DrugService(request.context).updateDrug(request.params.id, request.body).then(function(drug) {
                return DrugMapper.map(drug);
            });
        },

        deleteDrug : function(request) {
            return new DrugService(request.context).deleteDrug(request.params.id).thenReturn({});
        }
    };

};

module.exports = new DrugsMiddleware();
