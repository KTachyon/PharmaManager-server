var moment = require('moment');
var rekuire = require('rekuire');
var configuration = rekuire('configuration');

var blockTime = configuration.getBlockTime();

var UserUtil = function() {

	return {

		isUserBlocked: function(blockedUser) {
			if (!blockedUser) { return false; }

			var minimumAt = moment().subtract(blockTime.value, blockTime.unit);
			var blockDate = moment(blockedUser.get('blocked'));

			return minimumAt.isBefore(blockDate);
		}

	};

};

module.exports = new UserUtil();
