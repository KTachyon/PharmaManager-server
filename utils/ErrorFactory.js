var _ = require('lodash');

var ErrorFactory = function() {

    return {
        make : function(message, statusCode) {
            var finalMessage = _.isObject(message) ? JSON.stringify(message) : message;

            var error = new Error(finalMessage);
            error.statusCode = statusCode;
            
            return error;
        }
    };
};

module.exports = new ErrorFactory();
