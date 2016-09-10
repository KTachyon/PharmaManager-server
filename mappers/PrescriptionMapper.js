var _ = require('lodash');

var PrescriptionMapper = function() {

	return {
		map: function(prescriptionData) {
			return (prescriptionData instanceof Array) ? this.mapList(prescriptionData) : this.mapSingle(prescriptionData);
		},

		mapList: function(prescriptions) {
            var self = this;

			return _.map(prescriptions, function(prescription) { return self.mapSingle(prescription); });
		},

		mapSingle: function(prescription) {
			var daoObject = {
				drugID : prescription.get('DrugId'),
                patientID : prescription.get('PatientId'),
                prescriptionDate : prescription.get('prescriptionDate'),
            	timeRange : prescription.get('timeRange'),
            	intakeInterval : prescription.get('intakeInterval'),
            	intakeQuantity : prescription.get('intakeQuantity'),
				properties : prescription.get('properties')
			};

			return daoObject;
		}
	};

};

module.exports = new PrescriptionMapper();
