var rekuire = require('rekuire');
var Patient = rekuire('models/Patient');

var ErrorFactory = rekuire('utils/ErrorFactory');

var PatientService = function(context) {

    var getTransaction = context.getTransaction;

    return {
        getAllPatients : function() {
            return Patient.findAll({ transaction : getTransaction() });
        },

        getPatient : function(id) {
            return Patient.findById(id, { transaction : getTransaction() }).then(function(patient) {
                if (!patient) { throw ErrorFactory.make('Patient not found', 404); }

                return patient;
            });
        },

        searchPatient : function(searchTerms) {
            // TODO: https://www.postgresql.org/docs/9.1/static/fuzzystrmatch.html
        },

        createPatient : function(data) {
            return Patient.create(data, { transaction : getTransaction() });
        },

        updatePatient : function(id, data) {
            return Patient.update(data, { where : { id : id }, transaction : getTransaction() }); // TODO: update returns array of changed rows
        },

        deletePatient : function(id) {
            return Patient.destroy({ where : { id : id }, transaction : getTransaction() });  // TODO: update returns deleted rows
        }
    };

};

module.exports = PatientService;
