var _ = require('lodash');
var rekuire = require('rekuire');
var DrugMapper = rekuire('mappers/DrugMapper');

var PosologyMapper = function() {

    return {
        map: function(posologyData) {
            return (posologyData instanceof Array)
                ? this.mapList(posologyData)
                : this.mapSingle(posologyData);
        },

        mapList: function(posologies) {
            var self = this;

            return _.map(posologies, function(posology) {
                return self.mapSingle(posology);
            });
        },

        mapSingle: function(posology) {
            var daoObject = {
                id : posology.get('id'),
                drug: DrugMapper.map(posology.Drug),
                PatientID: posology.get('PatientId'),
                startDate: posology.get('posologyDate'),
                timeRange: posology.get('timeRange'),
                intakeTimes: posology.get('intakeTimes'),
                intakeQuantity: posology.get('intakeQuantity'),
                properties: posology.get('properties')
            };

            return daoObject;
        }
    };

};

module.exports = new PosologyMapper();
