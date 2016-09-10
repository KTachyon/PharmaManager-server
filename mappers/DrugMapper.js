var _ = require('lodash');

var DrugMapper = function() {

	return {
		map: function(drugData) {
			return (drugData instanceof Array) ? this.mapList(drugData) : this.mapSingle(drugData);
		},

		mapList: function(drugs) {
            var self = this;

			return _.map(drugs, function(drug) { return self.mapSingle(drug); });
		},

		mapSingle: function(drug) {
			var daoObject = {
				id : drug.get('id'),
				name : drug.get('name'),
				properties : drug.get('properties')
			};

			return daoObject;
		}
	};

};

module.exports = new DrugMapper();
