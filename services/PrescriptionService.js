var rekuire = require('rekuire');
var Prescription = rekuire('models/Prescription');

var ErrorFactory = rekuire('utils/ErrorFactory');

var PrescriptionService = function(context) {

    var getTransaction = context.getTransaction;

    return {
        getAllPrescriptionsForPatient : function() {
            return Prescription.findAll({ where : { PatientId : context.patient }}, { transaction : getTransaction() });
        },

        getPrescriptionForPatient : function(drugID) {
            return Prescription.find({ where : { PatientId : context.patient, DrugId : drugID }}, { transaction : getTransaction() }).then(function(prescription) {
                if (!prescription) { throw ErrorFactory.make('Prescription not found', 404); }

                return prescription;
            });
        },

        createPrescriptionForPatient : function(drugID, data) {
            data.DrugId = drugID;
            data.PatientId = context.patient;

            return Prescription.create(data, { transaction : getTransaction() });
        },

        updatePrescriptionForPatient : function(drugID, data) {
            data.DrugId = drugID;
            data.PatientId = context.patient;

            return Prescription.update(data, { where : { PatientId : context.patient, DrugId : drugID }, transaction : getTransaction() }); // TODO: update returns array of changed rows
        },

        deletePrescriptionForPatient : function(drugID) {
            return Prescription.destroy({ where : { PatientId : context.patient, DrugId : drugID }, transaction : getTransaction() });  // TODO: update returns deleted rows
        }
    };

};

module.exports = PrescriptionService;
