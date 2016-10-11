var express = require('express');
var PosologysRouter = express.Router();

var rekuire = require('rekuire');
var Transactional = rekuire('middleware/Transactional');
var PosologyMiddleware = rekuire('middleware/posology');

// TODO: Must be bound to patient -> context route
// TODO: Missing Middleware, Service

PosologysRouter.get('/', Transactional(PosologyMiddleware.getAllPosology));
PosologysRouter.get('/:drug_id', Transactional(PosologyMiddleware.getPosology));
PosologysRouter.put('/:drug_id', Transactional(PosologyMiddleware.updatePosology));
PosologysRouter.post('/:drug_id', Transactional(PosologyMiddleware.createPosology));
PosologysRouter.delete('/:drug_id', Transactional(PosologyMiddleware.deletePosology));

module.exports = PosologysRouter;
