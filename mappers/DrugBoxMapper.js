var _ = require('lodash');
var rekuire = require('rekuire');
var DrugMapper = rekuire('mappers/DrugMapper');

var DrugBoxMapper = function() {

	return {
		map: function(drugBoxData) {
			return (drugBoxData instanceof Array) ? this.mapList(drugBoxData) : this.mapSingle(drugBoxData);
		},

		mapList: function(drugBoxes) {
            var self = this;

			return _.map(drugBoxes, function(drugBox) { return self.mapSingle(drugBox); });
		},

		mapSingle: function(drugBox) {
			var daoObject = {
				id : drugBox.get('id'),
				drug: DrugMapper.map(drugBox.Drug),
				expiresAt : drugBox.get('expiresAt'),
				openedAt : drugBox.get('openedAt'),
				unitCount : drugBox.get('unitCount'),
				brand : drugBox.get('brand'),
				productionNumber : drugBox.get('productionNumber'),
				properties : drugBox.get('properties')
			};

			return daoObject;
		}
	};

};

module.exports = new DrugBoxMapper();
