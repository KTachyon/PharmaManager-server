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

patientsRouter.post('/search', Transactional(PatientsMiddleware.searchPatients));

patientsRouter.use('/:id/posology', PatientsMiddleware.assignContextPatient, rekuire('routes/posology'));

module.exports = patientsRouter;
