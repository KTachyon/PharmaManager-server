var rekuire = require('rekuire');
var DrugStock = rekuire('models/DrugStock');
var Posology = rekuire('models/Posology');

var Drug = rekuire('models/Drug');
var Patient = rekuire('models/Patient');
var StockLog = rekuire('models/StockLog');

var moment = require('moment');
var _ = require('lodash');

var ErrorFactory = rekuire('utils/ErrorFactory');

var WeeklyStockUpdate = rekuire('models/WeeklyStockUpdate');

var DrugStockService = function(context) { // TODO: Account for schedule type

    var getTransaction = context.getTransaction;

    return {
        getAllDrugStock : function() {
            return DrugStock.findAll({
                where : { PatientId : context.patient },
                include : [ { model : Drug, required : true } ],
                transaction : getTransaction()
            });
        },

        createDrugStockIfNotExists : function(patientID, drugID) {
            return DrugStock.findOrCreate({
                where : { PatientId : patientID, DrugId : drugID },
                defaults : { unitCount : 0 },
                transaction : getTransaction()
            });
        },

        updateStockFor : function(drugID, amount, reason) {
            amount = parseInt(amount);

            return DrugStock.find({ where : { PatientId : context.patient, DrugId : drugID }, transaction : getTransaction() }).then((stock) => {
                if (!stock) {
                    throw ErrorFactory.make('Stock not found', 404);
                }

                stock.set('unitCount', stock.get('unitCount') + amount);

                if (stock.get('unitCount') < 0) {
                    throw ErrorFactory.make('There is no stock available to fulfill order (' + context.patient + ', ' + drugID + ', ' + amount +')', 400);
                }

                var log = { UserId : context.user.get('id'), reason : reason, changes : [ { StockId : stock.get('id'), amount : amount } ] };

                return Promise.all([
                    stock.save({ transaction : getTransaction() }),
                    StockLog.create(log, { transaction : getTransaction() })
                ]);
            }).spread((stock) => { return stock; });
        },

        stockRequiredForAWeek : function(posology) {
            var required = 0;

            if (posology.get('scheduleType') === 'DAILY') {
                required =  _.reduce(posology.get('intake'), (memo, intake) => {
                    return memo + (intake || 0);
                }, 0);

                required = required * 7;
            } else if (posology.get('scheduleType') === 'WEEKLY') {
                required =  _.reduce(posology.get('intake'), (memo, intake) => {
                    return memo + (intake || 0);
                }, 0);
            } else {
                var startMoment = moment(posology.get('startDate'));
                var nowMoment = moment();

                startMoment.month(nowMoment.month()); // Match month week

                if (startMoment.weekYear() === moment().weekYear()) {
                    required = posology.get('intake')[0];
                }
            }

            return Math.ceil(required);
        },

        weeklyStockUpdate : function() {
            var startDate = moment().startOf('week').toDate();
            var endDate = moment().endOf('week').toDate();

            return WeeklyStockUpdate.findAll({ where : { createdAt : { $between : [startDate, endDate] } }, transaction : getTransaction() }).then((result) => {
                if (result.length) {
                    throw ErrorFactory.make('Weekly medication was already subtracted from stock for this week', 400);
                }

                return this.buildStockReport(1);
            }).then((errors) => {
                if (errors.length) {
                    throw ErrorFactory.make('Insufficient Stock', 400);
                }

                return Promise.all([
                    Posology.findAll({ where : { cancelled : false }, transaction : getTransaction() }),
                    DrugStock.findAll({ transaction : getTransaction() })
                ]).spread((allPosologies, allDrugStocks) => {
                    var stocksAndLog = _.reduce(allPosologies, (memo, posology) => {
                        var stock = _.find(allDrugStocks, (drugStock) => {
                            return drugStock.get('PatientId') === posology.get('PatientId') && drugStock.get('DrugId') === posology.get('DrugId');
                        });

                        var weeklyIntake = this.stockRequiredForAWeek(posology);

                        stock.set('unitCount', stock.get('unitCount') - weeklyIntake);

                        memo.log.changes.push({ StockId : stock.get('id'), amount : -weeklyIntake });
                        memo.stock.push(stock);

                        return memo;
                    }, { stocks : [], log : { reason : 'weekly stock update', changes : [] } });

                    return Promise.all(
                        _.map(stocksAndLog.stocks, (stock) => {
                            return stock.save({ transaction : getTransaction() });
                        })
                        .concat(WeeklyStockUpdate.create({}, { transaction : getTransaction() }))
                        .concat(StockLog.create(stocksAndLog.log, { transaction : getTransaction() }))
                    );
                });
            });
        },

        buildStockReport : function(weeks) {
            var configurationWeeks = weeks || 4;
            var intakeDictionary = {};

            return Posology.findAll({ where : { cancelled : null }, transaction : getTransaction() }).then((allPosologies) => {
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
                console.log('found insufficientStocks:', insufficientStocks.length);

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
                    Drug.findAll({ where : { id : ids.DrugIDs }, attributes : ['id', 'name', 'dose', 'unit'], transaction : getTransaction() }),
                    Patient.findAll({ where : { id : ids.PatientIDs }, attributes : ['id', 'name'], transaction : getTransaction() })
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

                var stockErrorByPatientMap = _.reduce(errors, (memo, stock) => {
                    var item = {
                        DrugId : stock.DrugId,
                        Drug : stock.Drug,
                        stock : stock.stock,
                        required : stock.required
                    };

                    if (memo[stock.PatientId]) {
                        memo[stock.PatientId].stocks.push(item);
                    } else {
                        memo[stock.PatientId] = {
                            PatientId : stock.PatientId,
                            Patient : stock.Patient,
                            stocks : [ item ]
                        };
                    }

                    return memo;
                }, {});

                return _.map(stockErrorByPatientMap, (value) => value);
            });
        }
    };

};

module.exports = DrugStockService;
