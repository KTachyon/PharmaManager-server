var _ = require('lodash');

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
                drugID: posology.get('DrugId'),
                patientID: posology.get('PatientId'),
                startDate: posology.get('posologyDate'),
                timeRange: posology.get('timeRange'),
                intakeInterval: posology.get('intakeInterval'),
                intakeQuantity: posology.get('intakeQuantity'),
                properties: posology.get('properties')
            };

            return daoObject;
        }
    };

};

module.exports = new PosologyMapper();
