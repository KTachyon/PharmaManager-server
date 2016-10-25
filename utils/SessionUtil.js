var moment = require('moment');
var rekuire = require('rekuire');
var configuration = rekuire('configuration');

var sessionTime = configuration.getSessionTime();

var SessionUtil = function() {

	var getExpirationMoment = function(userSession) {
		return moment(userSession.get('updatedAt')).add(sessionTime.value, sessionTime.unit);
	};

	return {

		isSessionValid: function(userSession) {
			var minimumAt = moment().subtract(sessionTime.value, sessionTime.unit);
			var createdAt = moment(userSession.get('updatedAt'));

			return minimumAt.isBefore(createdAt) && !userSession.get('invalidated');
		},

		getCurrentTime: function() {
			return moment().format();
		},

		getExpirationDate: function(userSession) {
			return getExpirationMoment(userSession).format();
		}

	};

};

module.exports = new SessionUtil();
