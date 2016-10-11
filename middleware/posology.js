var rekuire = require('rekuire');
var PosologyService = rekuire('services/PosologyService');
var PosologyMapper = rekuire('mappers/PosologyMapper');

var PosologysMiddleware = function() {

    return {
        getAllPosology: function(request) {
            return new PosologyService(request.context).getAllPosologysForPatient().then(function(posologies) {
                return PosologyMapper.map(posologies);
            });
        },

        getPosology: function(request) {
            return new PosologyService(request.context).getPosologyForPatient(request.params.drug_id).then(function(posology) {
                return PosologyMapper.map(posology);
            });
        },

        createPosology: function(request) {
            return new PosologyService(request.context).createPosologyForPatient(request.params.drug_id, request.body).then(function(posology) {
                return PosologyMapper.map(posology);
            });
        },

        updatePosology: function(request) {
            return new PosologyService(request.context).updatePosologyForPatient(request.params.drug_id, request.body).then(function(posology) {
                return PosologyMapper.map(posology);
            });
        },

        deletePosology: function(request) {
            return new PosologyService(request.context).deletePosologyForPatient(request.params.drug_id).thenReturn({});
        }
    };

};

module.exports = new PosologysMiddleware();
