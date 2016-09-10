var express = require('express');
var medicationRouter = express.Router();

var rekuire = require('rekuire');
var Transactional = rekuire('middleware/Transactional');
var MedicationMiddleware = rekuire('middleware/medication');

medicationRouter.get('/', Transactional(MedicationMiddleware.getAllMedication));
medicationRouter.get('/:id', Transactional(MedicationMiddleware.getMedication));
medicationRouter.put('/:id', Transactional(MedicationMiddleware.updateMedication));
medicationRouter.post('/', Transactional(MedicationMiddleware.createMedication));
medicationRouter.delete('/:id', Transactional(MedicationMiddleware.deleteMedication));

module.exports = medicationRouter;
