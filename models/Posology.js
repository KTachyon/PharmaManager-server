var rekuire = require('rekuire');
var db = rekuire('config/db');

var Sequelize = require('sequelize');

var Patient = rekuire('models/Patient');
var Drug = rekuire('models/Drug');

var Posology = db.define('Posology', {
	startDate : {
		type : Sequelize.DATE,
		allowNull : false
	},
	discontinueAt : {
		type : Sequelize.DATE,
		allowNull : true // false if no date limit exists (chronical)
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
	cancelled : {
		type : Sequelize.BOOLEAN,
		defaultValue : false,
		allowNull : false
	},
	properties : {
		type : Sequelize.JSONB
	}
});

// These will be the primary unique key, no need to define a unique constraint
Posology.hasOne(Patient);
Posology.hasOne(Drug);

module.exports = Posology;
