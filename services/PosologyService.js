var rekuire = require('rekuire');
var Posology = rekuire('models/Posology');

var ErrorFactory = rekuire('utils/ErrorFactory');

var PosologyService = function(context) {

    var getTransaction = context.getTransaction;

    return {
        getAllPosologyForPatient : function() {
            return Posology.findAll({ where : { PatientId : context.patient }}, { transaction : getTransaction() });
        },

        getPosologyForPatient : function(drugID) {
            return Posology.find({ where : { PatientId : context.patient, DrugId : drugID }}, { transaction : getTransaction() }).then(function(posology) {
                if (!posology) { throw ErrorFactory.make('Posology not found', 404); }

                return posology;
            });
        },

        createPosologyForPatient : function(drugID, data) {
            data.DrugId = drugID;
            data.PatientId = context.patient;

            return Posology.create(data, { transaction : getTransaction() });
        },

        updatePosologyForPatient : function(drugID, data) {
            data.DrugId = drugID;
            data.PatientId = context.patient;

            return Posology.update(data, { where : { PatientId : context.patient, DrugId : drugID }, transaction : getTransaction() }); // TODO: update returns array of changed rows
        },

        deletePosologyForPatient : function(drugID) {
            return Posology.destroy({ where : { PatientId : context.patient, DrugId : drugID }, transaction : getTransaction() });  // TODO: update returns deleted rows
        }
    };

};

module.exports = PosologyService;
