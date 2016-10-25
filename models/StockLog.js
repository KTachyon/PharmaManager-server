var rekuire = require('rekuire');
var db = rekuire('config/db');

var Sequelize = require('sequelize');
var User = rekuire('models/User');

var StockLog = db.define('StockLog', {
    id : {
        type : Sequelize.UUID,
		primaryKey : true,
		defaultValue : Sequelize.UUIDV4
    },
    reason : {
        type : Sequelize.TEXT,
        allowNull: false
    },
    changes : {
        type : Sequelize.JSONB,
        defaultValue : []
    }
});

StockLog.belongsTo(User, { foreignKey : 'UserId' });

module.exports = StockLog;
