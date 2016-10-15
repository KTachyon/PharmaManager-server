var express = require('express');
var PosologysRouter = express.Router();

var rekuire = require('rekuire');
var Transactional = rekuire('middleware/Transactional');
var PosologyMiddleware = rekuire('middleware/posology');

PosologysRouter.get('/', Transactional(PosologyMiddleware.getPosology));
PosologysRouter.put('/:id', Transactional(PosologyMiddleware.updatePosology));
PosologysRouter.post('/', Transactional(PosologyMiddleware.createPosology));
PosologysRouter.delete('/:id', Transactional(PosologyMiddleware.deletePosology));

PosologysRouter.put('/:id/cancel', Transactional(PosologyMiddleware.cancelPosology));
PosologysRouter.put('/:id/uncancel', Transactional(PosologyMiddleware.uncancelPosology));

module.exports = PosologysRouter;
