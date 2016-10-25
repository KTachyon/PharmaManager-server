var rekuire = require('rekuire');
var db = rekuire('config/db');

var Sequelize = require('sequelize');

var Drug = db.define('Drug', {
    id : {
        type : Sequelize.UUID,
        primaryKey : true,
        defaultValue : Sequelize.UUIDV4
    },
    name : {
        type : Sequelize.STRING,
        allowNull : false
    },
    dose : {
        type : Sequelize.DOUBLE,
        allowNull : false
    },
    unit : {
        type : Sequelize.STRING,
        allowNull : false
    },
    tokens : {
        type : Sequelize.ARRAY(Sequelize.STRING)
    },
    properties : {
		type : Sequelize.JSONB
	}
}, {
    setterMethods : {
        name : function(name) {
            this.setDataValue('name', name);
            this.setDataValue('tokens', name.split(' '));
        },
        tokens : function() {}
    },
    classMethods : {
        getSearchVector: function() {
            return 'DrugText';
        },

        search: function(text, transaction) {
            var escapedText = db.getQueryInterface().escape(text);

            var query = 'SELECT * FROM "' + Drug.tableName + '"';
            query += ' WHERE ' + escapedText + ' % ANY(tokens)';

            return db.query(query, {
                type : db.QueryTypes.SELECT, model : Drug,
                transaction : transaction
            });
        }
    }
});

module.exports = Drug;
