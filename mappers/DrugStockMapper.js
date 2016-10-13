var _ = require('lodash');
var rekuire = require('rekuire');
var DrugMapper = rekuire('mappers/DrugMapper');

var DrugStockMapper = function() {

	return {
		map: function(drugStockData) {
			return (drugStockData instanceof Array) ? this.mapList(drugStockData) : this.mapSingle(drugStockData);
		},

		mapList: function(drugStocks) {
            var self = this;

			return _.map(drugStocks, function(drugStock) { return self.mapSingle(drugStock); });
		},

		mapSingle: function(drugStock) {
			var daoObject = {
				id : drugStock.get('id'),
                drug: DrugMapper.map(drugStock.Drug),
				unitCount : drugStock.get('unitCount'),
				log : drugStock.get('log'),
				properties : drugStock.get('properties')
			};

			return daoObject;
		}
	};

};

module.exports = new DrugStockMapper();
