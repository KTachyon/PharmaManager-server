var Finally = require('./finally');

module.exports = function(request, response) {
	var ctx = request.context;

	return function(restObject) {
		return ctx.commit(function() {
			if (ctx.userSession) {
				response.header('Set-Cookie', 'session_token=' + ctx.userSession.get('id') + '; Path=/; Max-Age=86400');
			}

			if (ctx.responseStrategy) { return ctx.responseStrategy(); }
			else { response.json(restObject); }
		}).finally(function() {
			new Finally(request, response)(null, restObject);
		});

	};

};
