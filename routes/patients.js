var express = require('express');
var patientsRouter = express.Router();

var rekuire = require('rekuire');
var Transactional = rekuire('middleware/Transactional');
var PatientsMiddleware = rekuire('middleware/patients');

patientsRouter.get('/', Transactional(PatientsMiddleware.getAllPatients));
patientsRouter.get('/:id', Transactional(PatientsMiddleware.getPatient));
patientsRouter.put('/:id', Transactional(PatientsMiddleware.updatePatient));
patientsRouter.post('/', Transactional(PatientsMiddleware.createPatient));
patientsRouter.delete('/:id', Transactional(PatientsMiddleware.deletePatient));

patientsRouter.use('/:id/prescriptions', PatientsMiddleware.assignContextPatient, rekuire('routes/prescriptions'));
patientsRouter.use('/:id/medication', PatientsMiddleware.assignContextPatient, rekuire('routes/medication'));

module.exports = patientsRouter;
