var rekuire = require('rekuire');
var PrescriptionService = rekuire('services/PrescriptionService');
var PrescriptionMapper = rekuire('mappers/PrescriptionMapper');

var PrescriptionsMiddleware = function() {

    return {
        getAllPrescriptions : function(request) {
        	return new PrescriptionService(request.context).getAllPrescriptionsForPatient().then(function(prescriptions) {
        		return PrescriptionMapper.map(prescriptions);
        	});
        },

        getPrescription : function(request) {
            return new PrescriptionService(request.context).getPrescriptionForPatient(request.params.drug_id).then(function(prescription) {
        		return PrescriptionMapper.map(prescription);
        	});
        },

        createPrescription : function(request) {
            return new PrescriptionService(request.context).createPrescriptionForPatient(request.params.drug_id, request.body).then(function(prescription) {
                return PrescriptionMapper.map(prescription);
            });
        },

        updatePrescription : function(request) {
            return new PrescriptionService(request.context).updatePrescriptionForPatient(request.params.drug_id, request.body).then(function(prescription) {
                return PrescriptionMapper.map(prescription);
            });
        },

        deletePrescription : function(request) {
            return new PrescriptionService(request.context).deletePrescriptionForPatient(request.params.drug_id).thenReturn({});
        }
    };

};

module.exports = new PrescriptionsMiddleware();
