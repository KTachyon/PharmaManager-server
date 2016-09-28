var rekuire = require('rekuire');
var Patient = rekuire('models/Patient');
var Prescription = rekuire('models/Prescription');
var Medication = rekuire('models/Medication');
var Drug = rekuire('models/Drug');

var _ = require('lodash');

var ErrorFactory = rekuire('utils/ErrorFactory');

var PatientService = function(context) {

    var getTransaction = context.getTransaction;

    return {
        includes : function() {
            return [ Drug, Medication ];
        },

        getAllPatients : function() {
            return Patient.findAll({ include : this.includes(), transaction : getTransaction() });
        },

        getPatient : function(id) {
            return Patient.findOne({
                where : { id : id },
                include : this.includes(),
                transaction : getTransaction()
            }).then(function(patient) {
                if (!patient) { throw ErrorFactory.make('Patient not found', 404); }

                return patient;
            });
        },

        searchPatients : function(searchTerms) {
            var self = this;

            return Patient.search(searchTerms, getTransaction()).then(function(patients) {
                var ids = _.map(patients, function(patient) {
                    return patient.get('id');
                });

                return Patient.findAll({ where : { id : ids }, include : self.includes(), transaction : getTransaction() });
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
