var rekuire = require('rekuire');
var MedicationService = rekuire('services/MedicationService');
var MedicationMapper = rekuire('mappers/MedicationMapper');

var MedicationMiddleware = function() {

    return {
        getAllMedication : function(request) {
        	return new MedicationService(request.context).getAllMedication().then(function(medication) {
        		return MedicationMapper.map(medication);
        	});
        },

        getMedication : function(request) {
            return new MedicationService(request.context).getMedication(request.params.id).then(function(medication) {
        		return MedicationMapper.map(medication);
        	});
        },

        createMedication : function(request) {
            return new MedicationService(request.context).createMedication(request.body).then(function(medication) {
                return MedicationMapper.map(medication);
            });
        },

        updateMedication : function(request) {
            return new MedicationService(request.context).updateMedication(request.params.id, request.body).then(function(medication) {
                return MedicationMapper.map(medication);
            });
        },

        deleteMedication : function(request) {
            return new MedicationService(request.context).deleteMedication(request.params.id).thenReturn({});
        }
    };

};

module.exports = new MedicationMiddleware();
