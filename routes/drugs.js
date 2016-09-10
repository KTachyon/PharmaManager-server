var express = require('express');
var drugsRouter = express.Router();

var rekuire = require('rekuire');
var Transactional = rekuire('middleware/Transactional');
var DrugsMiddleware = rekuire('middleware/drugs');

drugsRouter.get('/', Transactional(DrugsMiddleware.getAllDrugs));
drugsRouter.get('/:id', Transactional(DrugsMiddleware.getDrug));
drugsRouter.put('/:id', Transactional(DrugsMiddleware.updateDrug));
drugsRouter.post('/', Transactional(DrugsMiddleware.createDrug));
drugsRouter.delete('/:id', Transactional(DrugsMiddleware.deleteDrug));

module.exports = drugsRouter;
