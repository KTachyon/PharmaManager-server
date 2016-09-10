var rekuire = require('rekuire');
var db = rekuire('config/db');
var path = require('path');
var fs = require('fs');

// Load all models before generating
var normalizedPath = path.join(__dirname, "../models/");

fs.readdirSync(normalizedPath).forEach(function(file) {
	require(normalizedPath + file);
});

return db.sync().then(function() {
    console.log("DONE!");
}).catch(function(error) {
	console.log('Failed!');
	console.log('Reason:', error);
});
