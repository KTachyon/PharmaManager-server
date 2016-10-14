var _ = require('lodash');

var rekuire = require('rekuire');
var PosologyMapper = rekuire('mappers/PosologyMapper');
var DrugBoxMapper = rekuire('mappers/DrugBoxMapper');
var DrugStockMapper = rekuire('mappers/DrugStockMapper');

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
				Posologies : patient.Posologies ? PosologyMapper.map(patient.Posologies) : undefined,
				DrugBoxes : patient.DrugBoxes ? DrugBoxMapper.map(patient.DrugBoxes) : undefined,
				DrugStocks : patient.DrugStocks ? DrugStockMapper.map(patient.DrugStocks) : undefined,
				name : patient.get('name'),
				sns : patient.get('sns'),
				nif : patient.get('nif'),
				properties : patient.get('properties')
			};

			return daoObject;
		}
	};

};

module.exports = new PatientMapper();
