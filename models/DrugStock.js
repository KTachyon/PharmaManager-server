var rekuire = require('rekuire');
var db = rekuire('config/db');

var Sequelize = require('sequelize');

var Patient = rekuire('models/Patient');
var Drug = rekuire('models/Drug');

var DrugStock = db.define('DrugStock', {
    id : {
        type : Sequelize.UUID,
        primaryKey : true,
        defaultValue : Sequelize.UUIDV4
    },
    unitCount : {
        type : Sequelize.INTEGER,
        allowNull : false,
        validate : { min : 0 }
    },
    log : {
        type : Sequelize.JSONB, // TODO: Register removed units / date, assumed box?
        allowNull : false,
        defaultValue : []
    },
    DrugId : {
		type : Sequelize.UUID,
		allowNull : false,
		unique : 'posology_unique_drug_patient'
	},
	PatientId : {
		type : Sequelize.UUID,
		allowNull : false,
		unique : 'posology_unique_drug_patient'
	}
});

Drug.hasMany(DrugStock, { foreignKey : 'DrugId' });
Patient.hasMany(DrugStock, { foreignKey : 'PatientId' });

DrugStock.belongsTo(Drug, { foreignKey : 'DrugId' });
DrugStock.belongsTo(Patient, { foreignKey : 'PatientId' });

module.exports = DrugStock;
