var rekuire = require('rekuire');
var Patient = rekuire('models/Patient');
var _ = require('lodash');

var ErrorFactory = rekuire('utils/ErrorFactory');

var PatientService = function(context) {

    var getTransaction = context.getTransaction;

    return {
        getAllPatients : function() {
            return Patient.findAll({ transaction : getTransaction() });
        },

        getPatient : function(id) {
            return Patient.findOne({
                where : { id : id },
                transaction : getTransaction()
            }).then(function(patient) {
                if (!patient) { throw ErrorFactory.make('Patient not found', 404); }

                return patient;
            });
        },

        searchPatients : function(searchTerms) {
            return Patient.search(searchTerms, getTransaction()).then((patients) => {
                var ids = _.map(patients, function(patient) {
                    return patient.get('id');
                });

                return Patient.findAll({ where : { id : ids }, include : this.includes(), transaction : getTransaction() });
            });
        },

        createPatient : function(data) {
            var self = this;

            return Patient.create(data, { transaction : getTransaction() }).then(function(patient) {
                return self.getPatient(patient.get('id'));
            });
        },

        updatePatient : function(id, data) {
            var self = this;

            return Patient.update(data, { where : { id : id }, transaction : getTransaction() }).then(function() {
                return self.getPatient(id);
            }); // TODO: update returns array of changed rows
        },

        deletePatient : function(id) {
            return Patient.destroy({ where : { id : id }, transaction : getTransaction() });  // TODO: update returns deleted rows
        }
    };

};

module.exports = PatientService;
