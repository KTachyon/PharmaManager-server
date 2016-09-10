var rekuire = require('rekuire');
var PatientService = rekuire('services/PatientService');
var PatientMapper = rekuire('mappers/PatientMapper');

var PatientsMiddleware = function() {

    return {
        assignContextPatient : function(request, response, next) {
            request.context.patient = request.params.id;

            next();
        },

        getAllPatients : function(request) {
        	return new PatientService(request.context).getAllPatients().then(function(patients) {
        		return PatientMapper.map(patients);
        	});
        },

        getPatient : function(request) {
            return new PatientService(request.context).getPatient(request.params.id).then(function(patient) {
        		return PatientMapper.map(patient);
        	});
        },

        createPatient : function(request) {
            return new PatientService(request.context).createPatient(request.body).then(function(patient) {
                return PatientMapper.map(patient);
            });
        },

        updatePatient : function(request) {
            return new PatientService(request.context).updatePatient(request.params.id, request.body).then(function(patient) {
                return PatientMapper.map(patient);
            });
        },

        deletePatient : function(request) {
            return new PatientService(request.context).deletePatient(request.params.id).thenReturn({});
        }
    };

};

module.exports = new PatientsMiddleware();
