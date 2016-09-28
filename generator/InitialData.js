var rekuire = require('rekuire');
var Patient = rekuire('models/Patient');
var Drug = rekuire('models/Drug');

var _ = require('lodash');
var Promise = require('bluebird');

function generate(array) {
    return _.map(array, function(name) {
        return { name };
    });
}

module.exports = function() {
    var names = rekuire('generator/names');
    var drugs = rekuire('generator/drugs');

    return Promise.all([
        Patient.bulkCreate( generate(names) ),
        Drug.bulkCreate( generate(drugs) )
    ]);
};
