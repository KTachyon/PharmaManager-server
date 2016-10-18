var rekuire = require('rekuire');
var Patient = rekuire('models/Patient');
var Drug = rekuire('models/Drug');

var Posology = rekuire('models/Posology');

var _ = require('lodash');
var Promise = require('bluebird');

function generateNDigitNumber(N) {
    var digitMP = Math.pow(10, N - 1);

    return Math.floor(Math.random() * 9 * digitMP) + digitMP;
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
}

function generatePatients(array) {
    return _.map(array, (object) => {
        var sns = generateNDigitNumber(9);
        var nif = generateNDigitNumber(9);

        return { name : object.name, sns, nif };
    });
}

function generateDrugs(array) {
    var uniqueDrugs = _.uniqWith(array, (a, b) => {
        return a.name === b.name && a.dose === b.dose;
    });

    return _.map(uniqueDrugs, (object) => {
        return { name : object.name, dose : object.dose, unit : 'mg' };
    });
}

function generatePosologies(patients, drugs) {
    var posologies = _.reduce(patients, (memo, patient) => {
        var numberOfPosologiesForPatient = randomNumber(3, 9);
        var currentDrugs = drugs;

        for (var i = 0; i < numberOfPosologiesForPatient; i++) {
            var drug = _.sample(currentDrugs);
            currentDrugs = _.without(currentDrugs, drug);

            var scheduleRandom = Math.random();
            var scheduleType, x;
            var intake = [];

            if (scheduleRandom < 0.6) {
                scheduleType = 'WEEKLY';

                for (x = 0; x < 7 * 4; x++) {
                    intake.push(randomNumber(0, 1));
                }
            } else if (scheduleRandom < 0.9) {
                scheduleType = 'DAILY';

                for (x = 0; x < 4; x++) {
                    intake.push(randomNumber(0, 1));
                }
            } else {
                scheduleType = 'MONTHLY';

                intake.push(1);
            }

            memo.push({
                DrugId : drug.get('id'),
                PatientId : patient.get('id'),
                startDate : new Date(),
                scheduleType : scheduleType,
                intake : intake
            });
        }

        return memo;
    }, []);

    return Posology.bulkCreate(posologies);
}

module.exports = function() {
    var names = rekuire('generator/names');
    var drugs = rekuire('generator/drugs');

    return Promise.all([
        Patient.bulkCreate( generatePatients(names) ),
        Drug.bulkCreate( generateDrugs(drugs) )
    ]).then(() => {
        return Promise.all([
            Patient.findAll(),
            Drug.findAll()
        ]);
    }).spread((patients, drugs) => {
        return generatePosologies(patients, drugs);
    });
};
