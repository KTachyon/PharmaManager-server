var rekuire = require('rekuire');
var db = rekuire('config/db');

var Sequelize = require('sequelize');

var Patient = rekuire('models/Patient');
var Drug = rekuire('models/Drug');

var Prescription = db.define('Prescription', {
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
