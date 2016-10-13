var rekuire = require('rekuire');
var db = rekuire('config/db');

var Sequelize = require('sequelize');

var Patient = rekuire('models/Patient');
var Drug = rekuire('models/Drug');

var DrugBox = db.define('DrugBox', {
    id : {
        type : Sequelize.UUID,
        primaryKey : true,
        defaultValue : Sequelize.UUIDV4
    },
    expiresAt : {
        type : Sequelize.DATE,
        allowNull : true // TODO: Drugs without expiration date
    },
    openedAt : {
        type : Sequelize.DATE,
        allowNull : true // Closed boxes don't have an open date
    },
    unitCount : {
        type : Sequelize.INTEGER,
        allowNull : false
    },
    brand : {
        type : Sequelize.STRING,
        allowNull : true // TODO: Unbranded drugs?
    },
    productionNumber : {
        type : Sequelize.STRING,
        allowNull : false
    },
	properties : {
		type : Sequelize.JSONB
	}
});

Drug.hasMany(DrugBox);
Patient.hasMany(DrugBox);

DrugBox.belongsTo(Drug);
DrugBox.belongsTo(Patient);

module.exports = DrugBox;
