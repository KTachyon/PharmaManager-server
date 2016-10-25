var rekuire = require('rekuire');
var db = rekuire('db');
var Sequelize = require('sequelize');

var PasswordUtils = rekuire('utils/PasswordUtils');

var User = db.define('User', {
	id : {
		type : Sequelize.UUID,
		primaryKey : true,
		defaultValue : Sequelize.UUIDV4
	},
	name : {
		type : Sequelize.STRING,
		allowNull : false
	},
	email : {
		type : Sequelize.STRING,
		unique : true,
		validate : {
			isEmail : true
		},
		set : function(email) {
			return this.setDataValue('email', email.toString().toLowerCase());
		}
	},
	password : {
		type : Sequelize.STRING(128),
		allowNull : false,
		set : function(password) {
			return this.setDataValue('password', PasswordUtils.hash(password));
		}
	}
});

module.exports = User;
