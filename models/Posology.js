var rekuire = require('rekuire');
var db = rekuire('config/db');

var Sequelize = require('sequelize');

var Patient = rekuire('models/Patient');
var Drug = rekuire('models/Drug');

var Posology = db.define('Posology', {
	id : {
        type : Sequelize.UUID,
        primaryKey : true,
        defaultValue : Sequelize.UUIDV4
    },
	startDate : {
		type : Sequelize.DATE,
		allowNull : false
	},
	discontinueAt : {
		type : Sequelize.DATE,
		allowNull : true // false if no date limit exists (chronical)
	},
	intakeTimes : {
		type : Sequelize.JSONB,
		allowNull : false,
		defaultValue : [ false, false, false, false ] // Breakfast, Lunch, Snack, Diner
	},
	intakeQuantity : {
		type : Sequelize.FLOAT, // half to multiple pills?
		allowNull : false,
		defaultValue : 1
	},
	notes : {
		type : Sequelize.TEXT,
		allowNull : true
	},
	cancelled : {
		type : Sequelize.DATE,
		allowNull : true,
		unique : 'pposology_unique_drug_patient_cancelled'
	},
	properties : {
		type : Sequelize.JSONB
	},
	DrugId : {
		type : Sequelize.UUID,
		allowNull : false,
		unique : 'pposology_unique_drug_patient_cancelled'
	},
	PatientId : {
		type : Sequelize.UUID,
		allowNull : false,
		unique : 'pposology_unique_drug_patient_cancelled'
	}
});

// TODO: Drug-Patient pair should be unique!!!

// These will be the primary unique key, no need to define a unique constraint
Drug.hasMany(Posology, { foreignKey : 'DrugId' });
Patient.hasMany(Posology, { foreignKey : 'PatientId' });

Posology.belongsTo(Drug, { foreignKey : 'DrugId' });
Posology.belongsTo(Patient, { foreignKey : 'PatientId' });

module.exports = Posology;
