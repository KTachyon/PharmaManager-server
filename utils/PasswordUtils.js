var crypto = require('crypto');
var passwordRegex = /^[!-~]{8,50}$/;

var PasswordUtils = {
    hash : function(password) {
        var hash = crypto.createHash('sha512'); // TODO: Maybe add salt
        hash.update(password);

        return hash.digest('hex');
    },

    isValid : function(password) {
        return (password && password.match(passwordRegex));
    },

    matches : function(password, hash) {
        return (this.hash(password) === hash);
    }
};

module.exports = PasswordUtils;
