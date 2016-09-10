var _ = require('lodash');

var MedicationMapper = function() {

	return {
		map: function(medicationData) {
			return (medicationData instanceof Array) ? this.mapList(medicationData) : this.mapSingle(medicationData);
		},

		mapList: function(medicationList) {
            var self = this;

			return _.map(medicationList, function(medication) { return self.mapSingle(medication); });
		},

		mapSingle: function(medication) {
			var daoObject = {
                id : medication.get('id'),
                medicationStartDate : medication.get('medicationStartDate'),
                data : medication.get('data'),
				properties : medication.get('properties')
			};

			return daoObject;
		}
	};

};

module.exports = new MedicationMapper();
