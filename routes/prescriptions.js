var express = require('express');
var prescriptionsRouter = express.Router();

var rekuire = require('rekuire');
var Transactional = rekuire('middleware/Transactional');
var PrescriptionsMiddleware = rekuire('middleware/prescriptions');

// TODO: Must be bound to patient -> context route
// TODO: Missing Middleware, Service

prescriptionsRouter.get('/', Transactional(PrescriptionsMiddleware.getAllPrescriptions));
prescriptionsRouter.get('/:drug_id', Transactional(PrescriptionsMiddleware.getPrescription));
prescriptionsRouter.put('/:drug_id', Transactional(PrescriptionsMiddleware.updatePrescription));
prescriptionsRouter.post('/:drug_id', Transactional(PrescriptionsMiddleware.createPrescription));
prescriptionsRouter.delete('/:drug_id', Transactional(PrescriptionsMiddleware.deletePrescription));

module.exports = prescriptionsRouter;
