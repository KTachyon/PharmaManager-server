var rekuire = require('rekuire');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');

var morgan = require('morgan');
var Promise = require('bluebird');
var _ = require('lodash');
var fs = require('fs');

var configuration = rekuire('config/configuration');

var logger = rekuire('utils/LoggerProvider').getLogger();

var readdirPromise = function(dirPath) {
	return new Promise(function(fulfill, reject) {
		fs.readdir(dirPath, function(err, files) {
            if (err) { reject(err); }
            else { fulfill(files); }
		});
	});
};

// Load all models before starting the server
var normalizedPath = path.join(__dirname, 'models/');

readdirPromise(normalizedPath).then(function(models) {
    _.each(models, function(model) {
        if ( _.endsWith(model, '.js') ) {
            logger.verbose('Loading model', model.replace('.js', ''));
            rekuire('models/' + model);
        }
    });
}).then(function() {
	// Prepare server
	var app = express();

	app.use(bodyParser.json());
	app.use(cookieParser());

	app.use(morgan('common'));

	// Setup routes (base entry point)
	app.use(configuration.getAPIBasePath(), rekuire('routes/api'));

	// Start listening
	app.listen(configuration.getServerPort());
	logger.info('API is running on port ' + configuration.getServerPort());
});
