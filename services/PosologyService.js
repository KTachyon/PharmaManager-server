var rekuire = require('rekuire');
var Posology = rekuire('models/Posology');
var Drug = rekuire('models/Drug');
var ErrorFactory = rekuire('utils/ErrorFactory');

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
            if (!data.DrugId) {
                throw ErrorFactory.make('Posology requires a drug reference', 400);
            }

            data.startDate = data.startDate || new Date();
            data.PatientId = context.patient;

            return Posology.create(data, { transaction : getTransaction() }).then((posology) => {
                return this.getPosology(posology.get('id'));
            });
        },

        updatePosology : function(id, data) {
            if (!data.DrugId) {
                throw ErrorFactory.make('Posology requires a drug reference', 400);
            }

            data.PatientId = context.patient;

            return Posology.update(data, { where : { PatientId : context.patient, id : id }, transaction : getTransaction() }).then((posology) => {
                return this.getPosology(posology.get('id'));
            }); // TODO: update returns array of changed rows
        },

        deletePosology : function(id) {
            return Posology.destroy({ where : { PatientId : context.patient, id : id }, transaction : getTransaction() });  // TODO: update returns deleted rows
        }
    };

};

module.exports = PosologyService;
