var rekuire = require('rekuire');
var db = rekuire('db');
var Sequelize = require('sequelize');

var BlockedUser = db.define('BlockedUser', {
  email : {
		type : Sequelize.STRING,
        primaryKey : true,
		validate : {
			isEmail : true
		},
		set : function(email) {
			return this.setDataValue('email', email.toString().toLowerCase());
		}
	},
    attempts : Sequelize.INTEGER,
    blocked : Sequelize.DATE
});

module.exports = BlockedUser;
