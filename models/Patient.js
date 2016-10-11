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
    nif : {
        type : Sequelize.STRING,
        allowNull : false,
        unique : true
    },
    sns : {
        type : Sequelize.STRING,
        allowNull : false,
        unique : true
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
            return 'PatientText';
        },

        search: function(text, transaction) {
            var escapedText = db.getQueryInterface().escape(text);

            var query = 'SELECT * FROM "' + Patient.tableName + '"';
            query += ' WHERE ' + escapedText + ' % ANY(tokens)';

            return db.query(query, {
                type : db.QueryTypes.SELECT, model : Patient,
                transaction : transaction
            });
        }
    }
});

module.exports = Patient;
