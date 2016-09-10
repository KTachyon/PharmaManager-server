var rekuire = require('rekuire');
var db = rekuire('config/db');

var Sequelize = require('sequelize');

var Patient = rekuire('models/Patient');

var Medication = db.define('Medication', {
    id : {
        type : Sequelize.UUID,
        primaryKey : true,
        defaultValue : Sequelize.UUIDV4
    },
    medicationStartDate : {
        type : Sequelize.DATE,
		allowNull : false
    },
    data : {
        type : Sequelize.JSON,
    },
	properties : {
		type : Sequelize.JSON
	}
}, {
	name : {
		plural : 'Medication',
		singular : 'Medication'
	}
});

Patient.hasMany(Medication, {
    onDelete : 'CASCADE',
    foreignKey : { name: 'PatientId', allowNull : false }
});

module.exports = Medication;
