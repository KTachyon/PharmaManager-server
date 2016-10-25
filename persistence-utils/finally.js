var rekuire = require('rekuire');
var DetachableProcessManager = rekuire('DetachableProcessManager');

module.exports = function(request) {
	var ctx = request.context;

	return function(error, data) {
		new DetachableProcessManager(ctx).runProcesses(error, data);
	};

};
