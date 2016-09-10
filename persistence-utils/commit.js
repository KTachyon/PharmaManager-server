module.exports = function(request, response) {
	var ctx = request.context;

	return function(restObject) {
		return ctx.commit(function() {
			if (ctx.responseStrategy) { return ctx.responseStrategy(); }
			else { response.json(restObject); }
		});

	};

};
