var rekuire = require('rekuire');
var DrugStock = rekuire('models/DrugStock');
var Posology = rekuire('models/Posology');

var Drug = rekuire('models/Drug');
var Patient = rekuire('models/Patient');

var _ = require('lodash');

var ErrorFactory = rekuire('utils/ErrorFactory');

var DrugStockService = function(context) {

    var getTransaction = context.getTransaction;

    return {
        getAllDrugStock : function() {
            return DrugStock.findAll({
                where : { PatientId : context.patient },
                include : [ { model : Drug, required : true } ],
                transaction : getTransaction()
            });
        },

        updateStockFor : function(patientID, drugID, amount, reason) {
            amount = parseInt(amount);

            return DrugStock.find({ where : { PatientId : patientID, DrugId : drugID }, transaction : getTransaction() }).then((stock) => {
                if (stock) {
                    var log = stock.get('log') || [];
                    log.push({ reason : reason, time : new Date(), change: amount });

                    stock.set('unitCount', stock.get('unitCount') + amount);
                    stock.set('log', log);

                    if (stock.get('unitCount') < 0) {
                        throw ErrorFactory.make('There is no stock available to fulfill order (' + patientID + ', ' + drugID + ', ' + amount +')', 400);
                    }

                    return stock.save({ transaction : getTransaction() });
                }

                if (amount < 0) {
                    throw ErrorFactory.make('There is no stock available to fulfill order (' + patientID + ', ' + drugID + ', ' + amount +')', 400);
                }

                return DrugStock.create({
                    PatientId : patientID,
                    DrugId : drugID,
                    unitCount : amount
                }, { transaction : getTransaction() });
            });
        },

        stockRequiredForAWeek : function(posology) {
            var required = posology.get('intakeQuantity') * _.reduce(posology.get('intakeTimes'), (memo, isIntakeTime) => {
                return memo + (isIntakeTime ? 1 : 0);
            }, 0);

            return Math.ceil(required);
        },

        weeklyStockUpdate : function() {
            return this.buildStockReport().then((errors) => {
                if (errors.length) {
                    throw ErrorFactory.make('Insufficient Stock', 400);
                }

                return Promise.all([
                    Posology.findAll({ where : { cancelled : false }, transaction : getTransaction() }),
                    DrugStock.findAll({ transaction : getTransaction() })
                ]).spread((allPosologies, allDrugStocks) => {
                    var dirtyDrugStocks = _.reduce(allPosologies, (memo, posology) => {
                        var stock = _.find(allDrugStocks, (drugStock) => {
                            return drugStock.get('PatientId') === posology.get('PatientId') && drugStock.get('DrugId') === posology.get('DrugId');
                        });

                        var weeklyIntake = this.stockRequiredForAWeek(posology);


                        var log = stock.get('log') || [];
                        log.push({ reason : 'weekly stock update', time : new Date(), change : -weeklyIntake });

                        stock.set('unitCount', stock.get('unitCount') - weeklyIntake);
                        stock.set('log', log);

                        memo.push(stock);

                        return memo;
                    }, []);

                    return Promise.all( _.map(dirtyDrugStocks, (stock) => {
                        return stock.save({ transaction : getTransaction() });
                    }));
                });
            });
        },

        buildStockReport : function(weeks) {
            var configurationWeeks = weeks || 1;
            var intakeDictionary = {};

            return Posology.findAll({ where : { cancelled : false }, transaction : getTransaction() }).then((allPosologies) => {
                var stockQuery = _.map(allPosologies, (posology) => {
                    var weeklyIntake = this.stockRequiredForAWeek(posology);

                    intakeDictionary[ posology.get('PatientId') + '_' + posology.get('DrugId') ] = weeklyIntake;

                    return {
                        PatientId : posology.get('PatientId'),
                        DrugId : posology.get('DrugId'),
                        unitCount : { $lt : weeklyIntake * configurationWeeks }
                    };
                });

                return DrugStock.findAll({ where : { $or : stockQuery }, transaction : getTransaction() });
            }).then((insufficientStocks) => {
                return _.map(insufficientStocks, (stock) => {
                    return {
                        PatientId : stock.get('PatientId'),
                        DrugId : stock.get('DrugId'),
                        stock : stock ? stock.get('unitCount') : 0,
                        required : intakeDictionary[ stock.get('PatientId') + '_' + stock.get('DrugId') ]
                    };
                });
            });
        },

        getStockReport : function() {
            return this.buildStockReport().then((errors) => {
                var ids = _.reduce(errors, (memo, error) => {
                    memo.PatientIDs.push(error.PatientId);
                    memo.DrugIDs.push(error.DrugId);

                    return memo;
                }, { PatientIDs : [], DrugIDs : [] });

                ids.PatientIDs = _.uniq(ids.PatientIDs);
                ids.DrugIDs = _.uniq(ids.DrugIDs);

                return Promise.all([
                    errors,
                    Drug.findAll({ where : { id : ids.DrugIDs }, transaction : getTransaction() }),
                    Patient.findAll({ where : { id : ids.PatientIDs }, transaction : getTransaction() })
                ]);
            }).spread((errors, drugs, patients) => {
                _.each(errors, (error) => {
                    error.Drug = _.find(drugs, (drug) => {
                        return error.DrugId === drug.get('id');
                    });

                    error.Patient = _.find(patients, (patient) => {
                        return error.PatientId === patient.get('id');
                    });
                });

                return errors;
            });
        }
    };

};

module.exports = DrugStockService;
