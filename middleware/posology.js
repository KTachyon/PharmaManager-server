var rekuire = require('rekuire');
var PosologyService = rekuire('services/PosologyService');
var PosologyMapper = rekuire('mappers/PosologyMapper');

var PosologysMiddleware = function() {

    return {
        getPosology: function(request) {
            return new PosologyService(request.context).getAllPosology().then(function(posologies) {
                return PosologyMapper.map(posologies);
            });
        },

        createPosology: function(request) {
            return new PosologyService(request.context).createPosology(request.body).then(function(posology) {
                return PosologyMapper.map(posology);
            });
        },

        updatePosology: function(request) {
            return new PosologyService(request.context).updatePosology(request.params.id, request.body).then(function(posology) {
                return PosologyMapper.map(posology);
            });
        },

        deletePosology: function(request) {
            return new PosologyService(request.context).deletePosology(request.params.id).thenReturn({});
        },

        cancelPosology : function(request) {
            return new PosologyService(request.context).cancelPosology(request.params.id).thenReturn({});
        },

        uncancelPosology : function(request) {
            return new PosologyService(request.context).uncancelPosology(request.params.id).thenReturn({});
        }
    };

};

module.exports = new PosologysMiddleware();
