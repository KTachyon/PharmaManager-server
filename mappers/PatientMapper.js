var _ = require('lodash');

var PatientMapper = function() {

	return {
		map: function(patientData) {
			return (patientData instanceof Array) ? this.mapList(patientData) : this.mapSingle(patientData);
		},

		mapList: function(patients) {
            var self = this;

			return _.map(patients, function(patient) { return self.mapSingle(patient); });
		},

		mapSingle: function(patient) {
			var daoObject = {
				id : patient.get('id'),
				name : patient.get('name'),
				properties : patient.get('properties')
			};

			return daoObject;
		}
	};

};

module.exports = new PatientMapper();
