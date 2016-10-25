var rekuire = require('rekuire');
var SessionUtil = rekuire('utils/SessionUtil');

module.exports = (function() {

	return {
		map: function(userSession) {
			return {
				sessionToken : userSession.get('id'),
				currentTime : SessionUtil.getCurrentTime(),
				expiration : SessionUtil.getExpirationDate(userSession)
			};
		}
	};

})();
