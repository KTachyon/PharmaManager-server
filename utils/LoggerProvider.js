var rekuire = require('rekuire');
var intel = require('intel');
var configuration = rekuire('configuration');

intel.basicConfig({
    format: '[%(date)s] %(name)s:: %(message)s',
    level : configuration.getLogLevel()
});

var LoggerProvider = function() {

    return {
        getLogger : function(descriptor) {
            return intel.getLogger(descriptor || 'api');
        }
    };

};

module.exports = new LoggerProvider();
