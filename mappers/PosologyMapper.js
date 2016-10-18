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
                discontinueAt: posology.get('discontinueAt'),
                scheduleType : posology.get('scheduleType'),
                intake: posology.get('intake'),
                cancelled : posology.get('cancelled'),
                properties: posology.get('properties')
            };

            return daoObject;
        }
    };

};

module.exports = new PosologyMapper();
