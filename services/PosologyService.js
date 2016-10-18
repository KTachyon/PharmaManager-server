var rekuire = require('rekuire');
var Posology = rekuire('models/Posology');
var Drug = rekuire('models/Drug');
var ErrorFactory = rekuire('utils/ErrorFactory');

var sanitizePosologyInput = function(data, id) {
    if (!data.DrugId) {
        throw ErrorFactory.make('Posology requires a drug reference', 400);
    }

    return { // TODO: Cancelling
        id : id,
        startDate : data.startDate,
        discontinueAt : data.discontinueAt,
        scheduleType : data.scheduleType,
        intake : data.intake, // TODO: Parse intake?
        notes : data.notes,
        properties : data.properties,
        DrugId : data.DrugId
    };
};

var PosologyService = function(context) {

    var getTransaction = context.getTransaction;

    return {
        getAllPosology : function() {
            return Posology.findAll({ where : { PatientId : context.patient }, include : [ { model : Drug, required : true } ], transaction : getTransaction() });
        },

        getPosology : function(id) {
            return Posology.find({ where : { id : id }, include : [ { model : Drug, required : true } ], transaction : getTransaction() });
        },

        createPosology : function(data) {
            data = sanitizePosologyInput(data);
            data.startDate = data.startDate || new Date();
            data.PatientId = context.patient;

            return Posology.create(data, { transaction : getTransaction() }).then((posology) => {
                return this.getPosology(posology.get('id'));
            });
        },

        updatePosology : function(id, data) {
            data = sanitizePosologyInput(data);
            data.PatientId = context.patient;

            return Posology.update(data, { where : { PatientId : context.patient, id : id }, transaction : getTransaction() }).then(() => {
                return this.getPosology(id);
            }); // TODO: update returns array of changed rows
        },

        deletePosology : function(id) {
            return Posology.destroy({ where : { PatientId : context.patient, id : id }, transaction : getTransaction() });  // TODO: update returns deleted rows
        },

        cancelPosology : function(id) {
            return Posology.find({ where : { PatientId : context.patient, id : id, cancelled : null }, transaction : getTransaction() }).then((posology) => {
                posology.set('cancelled', new Date());
                return posology.save({ transaction : getTransaction() });
            });
        },

        uncancelPosology : function(id) {
            return Posology.find({ where : { PatientId : context.patient, id : id, cancelled : { $ne : null } }, transaction : getTransaction() }).then((posology) => {
                posology.set('cancelled', null);
                return posology.save({ transaction : getTransaction() });
            });
        }
    };

};

module.exports = PosologyService;
