var rekuire = require('rekuire');
var db = rekuire('config/db');

var Sequelize = require('sequelize');

var Patient = rekuire('models/Patient');
var Drug = rekuire('models/Drug');

var Prescription = db.define('Prescription', {
	prescriptionDate : {
		type : Sequelize.DATE,
		allowNull : false
	},
	timeRange : {
		type : Sequelize.INTEGER, // days?
		allowNull : false // ok?
	},
	intakeInterval : {
		type : Sequelize.INTEGER, // hours
		allowNull : false
	},
	intakeQuantity : {
		type : Sequelize.FLOAT, // half to multiple pills?
		allowNull : false,
		defaultValue : 1
	},
	properties : {
		type : Sequelize.JSON
	}
});

// These will be the primary unique key, no need to define a unique constraint
Patient.belongsToMany(Drug, {
	onDelete : 'CASCADE',
    through: { model : Prescription },
    foreignKey : { name: 'PatientId', allowNull : false }
});

Drug.belongsToMany(Patient, {
	onDelete : 'CASCADE',
    through: { model : Prescription },
    foreignKey : { name: 'DrugId', allowNull : false }
});

module.exports = Prescription;
