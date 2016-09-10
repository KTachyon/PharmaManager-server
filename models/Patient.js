var rekuire = require('rekuire');
var db = rekuire('config/db');

var Sequelize = require('sequelize');

var Patient = db.define('Patient', {
    id : {
        type : Sequelize.UUID,
		primaryKey : true,
		defaultValue : Sequelize.UUIDV4
    },
    name : {
        type : Sequelize.STRING,
        allowNull : false
    },
    properties : {
		type : Sequelize.JSON
	}
});

module.exports = Patient;
