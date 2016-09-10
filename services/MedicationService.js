var rekuire = require('rekuire');
var Medication = rekuire('models/Medication');

var ErrorFactory = rekuire('utils/ErrorFactory');

var MedicationService = function(context) {

    var getTransaction = context.getTransaction;

    return {
        getAllMedicationForPatient : function() {
            return Medication.findAll({ where : { PatientId : context.patient }}, { transaction : getTransaction() });
        },

        getMedicationForPatient : function(id) {
            return Medication.find({ where : { PatientId : context.patient, id : id }}, { transaction : getTransaction() }).then(function(medication) {
                if (!medication) { throw ErrorFactory.make('Medication not found', 404); }

                return medication;
            });
        },

        createMedicationForPatient : function(data) {
            data.PatientId = context.patient;

            return Medication.create(data, { transaction : getTransaction() });
        },

        updateMedicationForPatient : function(id, data) {
            data.PatientId = context.patient;

            return Medication.update(data, { where : { PatientId : context.patient, id : id }, transaction : getTransaction() }); // TODO: update returns array of changed rows
        },

        deleteMedicationForPatient : function(id) {
            return Medication.destroy({ where : { PatientId : context.patient, id : id }, transaction : getTransaction() });  // TODO: update returns deleted rows
        }
    };

};

module.exports = MedicationService;
