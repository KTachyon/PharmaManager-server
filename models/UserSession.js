var rekuire = require('rekuire');
var db = rekuire('db');
var Sequelize = require('sequelize');

var User = rekuire('models/User');

var UserSession = db.define('UserSession', {
	id : {
		type : Sequelize.UUID,
		primaryKey : true,
		defaultValue : Sequelize.UUIDV4
	},
	invalidated : {
		type : Sequelize.DATE
	}
});

UserSession.belongsTo(User, {
    onDelete : 'CASCADE',
    foreignKey : { allowNull : false }
});

module.exports = UserSession;
