var rekuire = require('rekuire');
var AuthService = rekuire('services/AuthService');
var rollback = rekuire('persistence-utils/rollback');

var UserSessionMapper = rekuire('mappers/UserSessionMapper');

var AuthMiddleware = function() {

	return {

        login : function(request) {
            return new AuthService(request.context).loginUser(request.body.email, request.body.password).then((userSession) => {
				request.context.userSession = userSession;

                return UserSessionMapper.map(userSession);
            });
        },

        logout : function(request, response) {
            var sessionToken = request.cookies.session_token;

            return new AuthService(request.context).logoutUser(sessionToken).then(function() {
                response.header('Set-Cookie', 'session_token=deleted; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT');
            });
        },

        session : function(request) {
            var sessionToken = request.cookies.session_token;

            return new AuthService(request.context).autenticationCheck(sessionToken).then((userSession) => {
                return UserSessionMapper.map(userSession);
            });
        },

		authCheck: function(request, response, next) {
			if (!request.context.user) { // TODO: Simplify, use a context loader
                var sessionToken = request.cookies.session_token;

				return new AuthService(request.context).autenticationCheck(sessionToken).then(function(userSession) {
					request.context.user = userSession.User;
					request.context.userSession = userSession;
					next();
				}).catch(rollback(request, response));
			} else { next(); }
		}

	};

};

module.exports = new AuthMiddleware();
