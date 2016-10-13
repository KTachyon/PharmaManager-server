var rekuire = require('rekuire');
var DrugBoxService = rekuire('services/DrugBoxService');
var DrugBoxMapper = rekuire('mappers/DrugBoxMapper');

var DrugBoxesMiddleware = function() {

    return {
        getDrugBoxes: function(request) {
            return new DrugBoxService(request.context).getAllDrugBoxes().then(function(drugBoxes) {
                return DrugBoxMapper.map(drugBoxes);
            });
        },

        createDrugBox: function(request) {
            return new DrugBoxService(request.context).createDrugBox(request.body).then(function(drugBox) {
                return DrugBoxMapper.map(drugBox);
            });
        },

        updateDrugBox: function(request) {
            return new DrugBoxService(request.context).updateDrugBox(request.params.id, request.body).then(function(drugBox) {
                return DrugBoxMapper.map(drugBox);
            });
        },

        deleteDrugBox: function(request) {
            return new DrugBoxService(request.context).deleteDrugBox(request.params.id).thenReturn({});
        }
    };

};

module.exports = new DrugBoxesMiddleware();
