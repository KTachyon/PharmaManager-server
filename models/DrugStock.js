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
        allowNull : false
    },
    log : {
        type : Sequelize.JSONB, // TODO: Register removed units / date, assumed box?
        allowNull : false,
        defaultValue : []
    },
	properties : {
		type : Sequelize.JSONB
	}
});

Drug.hasMany(DrugStock);
Patient.hasMany(DrugStock);

DrugStock.belongsTo(Drug);
DrugStock.belongsTo(Patient);

module.exports = DrugStock;
