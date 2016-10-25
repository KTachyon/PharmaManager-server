var rekuire = require('rekuire');
var db = rekuire('config/db');

var User = rekuire('models/User');
var BlockedUser = rekuire('models/BlockedUser');
var UserSession = rekuire('models/UserSession');
var PasswordUtils = rekuire('utils/PasswordUtils');

var ErrorFactory = rekuire('utils/ErrorFactory');

var SessionUtil = rekuire('utils/SessionUtil');
var UserUtil = rekuire('utils/UserUtil');

var DetachableProcessManager = rekuire('DetachableProcessManager');

var Promise = require('bluebird');

var AuthService = function(context) {

    var getTransaction = context.getTransaction;
    var detachableProcessManager = new DetachableProcessManager(context);

    var createBlockedUser = function(transaction, email, attempts, blocked) {
        return BlockedUser.create({
            email: email,
            attempts: attempts,
            blocked: blocked
        }, {transaction: transaction});
    };

    var resetUserLoginAttempts = function(email) {
        return BlockedUser.find({
            where: {
                email: email
            },
            transaction: getTransaction()
        }).then(function(blockedUser) {
            if (!blockedUser) {
                return createBlockedUser(getTransaction(), email, 0);
            }

            blockedUser.set('attempts', 0);

            return blockedUser.save({transaction: getTransaction()});
        });
    };

    var fetchUserByEmail = function(email) {
		return User.find({
			where : { email : email },
			transaction : getTransaction()
		}).then(function(user) {
			if (!user) {
                throw ErrorFactory.make('User Not Found', 404);
			}

			return user;
		});
	};

    var handleBadPassword = function(email) {
        detachableProcessManager.attachProcess(function() {
            return db.transaction().then(function(authTransaction) {
                return BlockedUser.find({
                    where: {
                        email: email
                    },
                    transaction: authTransaction
                }).then(function(blockedUser) {
                    if (!blockedUser) {
                        return createBlockedUser(authTransaction, email, 1);
                    }

                    var attempts = blockedUser.get('attempts') + 1;

                    if (attempts >= UserUtil.getMaximumTentatives()) {
                        blockedUser.set('attempts', 0);
                        blockedUser.set('blocked', new Date());
                    } else {
                        blockedUser.set('attempts', attempts);
                    }

                    return blockedUser.save({transaction: authTransaction});
                }).then(function() {
                    return authTransaction.commit();
                }).catch(function(err) {
                    return authTransaction.rollback().throw(err);
                });
            });
        });
    };

    return {

        loginUser: function(email, password) {
			return Promise.try(() => {
				email = email.toLowerCase();

				return [
					fetchUserByEmail(email),
					BlockedUser.find({ where : { email : email }, transaction : getTransaction() })
				];
			}).spread((user, blockedUser) => {
                if (UserUtil.isUserBlocked(blockedUser)) {
                    throw ErrorFactory.make('Account blocked', 423);
                }

                if (!PasswordUtils.matches(password, user.get('password'))) {
                    handleBadPassword(user.get('email'));
                    throw ErrorFactory.make('Authentication failed', 401);
                }

                return resetUserLoginAttempts(email).thenReturn(user);
			}).then((user) => {
                return UserSession.create({ UserId : user.get('id') }, { transaction : getTransaction() });
			});
		},

        logoutUser: function(sessionToken) {
            return UserSession.find({
                where: { id: sessionToken, invalidated: null },
                transaction: getTransaction()
            }).then(function(userSession) {
                if (!userSession) {
                    throw ErrorFactory.make('Not logged it', 401);
                }

                userSession.set('invalidated', new Date());

                return userSession.save({ transaction: getTransaction() });
            }).then(function() {
                context.user = null;
                context.userSession = null;

                return {};
            });
        },

        autenticationCheck: function(sessionToken) {
            return UserSession.find({
                where: { id: sessionToken, invalidated: null },
                include: [ { model: User, required: true } ],
                transaction: getTransaction()
            }).then((userSession) => {
                if (!userSession || !SessionUtil.isSessionValid(userSession)) {
                    throw ErrorFactory.make('Unauthorized', 401);
                }

                return userSession;
            });
        },

        me: function() {
            return Promise.resolve(context.user); // TODO: This may be highly unsafe
        }

    };
};

module.exports = AuthService;
