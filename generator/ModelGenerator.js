var rekuire = require('rekuire');
var db = rekuire('config/db');
var path = require('path');
var fs = require('fs');

var InitialData = Promise.resolve();

if (process.argv[2]) {
	InitialData = rekuire('generator/InitialData');
}

function createExtensions() {
	return db.query('CREATE EXTENSION IF NOT EXISTS hstore;').then(function() {
        return db.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    }).then(function() {
		return db.query('CREATE EXTENSION IF NOT EXISTS pg_trgm;');
	});
}

// Load all models before generating
var normalizedPath = path.join(__dirname, '../models/');

fs.readdirSync(normalizedPath).forEach(function(file) {
	require(normalizedPath + file);
});

createExtensions().then(function() {
	return db.sync();
}).then(InitialData).then(function() {
    console.log('DONE!');
}).catch(function(error) {
	console.log('Failed!');
	console.log('Reason:', error);
});
