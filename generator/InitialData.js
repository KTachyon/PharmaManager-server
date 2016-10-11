var rekuire = require('rekuire');
var Patient = rekuire('models/Patient');
var Drug = rekuire('models/Drug');

var _ = require('lodash');
var Promise = require('bluebird');

function generatePatients(array) {
    var count = 0;

    return _.map(array, function(name) {
        var id = ++count;
        return { name, sns : id, nif : id };
    });
}

function generateDrugs(array) {
    return _.map(array, function(name) {
        return { name, dose : 1, unit : 'mg' };
    });
}

module.exports = function() {
    var names = rekuire('generator/names');
    var drugs = rekuire('generator/drugs');

    return Promise.all([
        Patient.bulkCreate( generatePatients(names) ),
        Drug.bulkCreate( generateDrugs(drugs) )
    ]);
};
