var rekuire = require('rekuire');
var logger = rekuire('utils/LoggerProvider').getLogger();
var Finally = require('./finally');

module.exports = function(request, response) {

	return function(err) {

		return request.context.rollback(function() {
			logger.error('Request failed. Will now rollback.', { route : request.path, error : err, stack : err.stack });
			response.status(err.statusCode || 500).send(err.message).end();
		}).finally(function() {
			new Finally(request, response)(err, null);
		});

	};

};
