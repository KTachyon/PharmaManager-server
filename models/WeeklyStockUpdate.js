var rekuire = require('rekuire');
var db = rekuire('config/db');

var Sequelize = require('sequelize');

var WeeklyStockUpdate = db.define('WeeklyStockUpdate', {
    id : {
        type : Sequelize.UUID,
        primaryKey : true,
        defaultValue : Sequelize.UUIDV4
    }
});

module.exports = WeeklyStockUpdate;
