var rekuire = require('rekuire');
var Patient = rekuire('models/Patient');
var _ = require('lodash');

var Posology = rekuire('models/Posology');
var DrugBox = rekuire('models/DrugBox');
var DrugStock = rekuire('models/DrugStock');
var Drug = rekuire('models/Drug');

var ErrorFactory = rekuire('utils/ErrorFactory');

var sanitizePatientInput = function(data, id) {
    return {
        id : id,
        name : data.name,
        nif : data.nif,
        sns : data.sns,
        properties : data.properties
    };
};

var PatientService = function(context) {

    var getTransaction = context.getTransaction;

    return {
        getAllPatients : function() {
            return Patient.findAll({ transaction : getTransaction() });
        },

        getPatient : function(id) {
            return Patient.findOne({
                where : { id : id },
                include : [
                    { model : Posology, include : [ Drug ] },
                    { model : DrugBox, include : [ Drug ] },
                    { model : DrugStock, include : [ Drug ] }
                ],
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
            return Patient.create(sanitizePatientInput(data), { transaction : getTransaction() }).then((patient) => {
                return this.getPatient(patient.get('id'));
            });
        },

        updatePatient : function(id, data) {
            return Patient.update(sanitizePatientInput(data, id), { where : { id : id }, transaction : getTransaction() }).then(() => {
                return this.getPatient(id);
            }); // TODO: update returns array of changed rows
        },

        deletePatient : function(id) {
            return Patient.destroy({ where : { id : id }, transaction : getTransaction() });  // TODO: update returns deleted rows
        }
    };

};

module.exports = PatientService;
