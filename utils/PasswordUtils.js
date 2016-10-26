var rekuire = require('rekuire');
var configuration = rekuire('configs/configuration');
var passwordRegex = /^[!-~]{8,50}$/;

var PasswordUtils = {
    hash : function(password) {
        return configuration.hashPassowrd({ password : password });
    },

    isValid : function(password) {
        return (password && password.match(passwordRegex));
    },

    matches : function(password, hash) {
        return (this.hash(password) === hash);
    }
};

module.exports = PasswordUtils;
