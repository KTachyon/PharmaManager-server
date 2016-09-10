var rekuire = require('rekuire');
var _ = require('lodash');

var configuration = rekuire('config/configuration');
var logger = rekuire('utils/LoggerProvider').getLogger();
var db = rekuire('db');

var APIMiddleware = function() {

    return {
        // Cross domain middleware, to support cross domain requests (if the API is in a different domain)
        setupCrossDomain : function(request, response, next) { // TODO: We can break every browser based API use by setting the allowed hosts here
        	var crossdomainHeaders = configuration.getCrossdomainHeaders();

        	logger.debug('Configuring CORS');

        	_.each(crossdomainHeaders, function(value, key) {
        		if (_.isFunction(value)) {
        			value = value(request);
        		}

        		response.header(key, value);
        	});

        	if (request.method === 'OPTIONS') { response.end(); }
        	else { next(); }
        },

        // all requests to this router will first hit this middleware
        // this will create a base transaction that all database queries must run on
        // if something bad happens, we just need to throw an error and rollback the transaction
        // so that the database is kept coherent
        transaction : function(request, response, next) {
        	// create request domain context
        	request.context = {};

        	logger.debug("Setting up transaction...");

        	// TODO: Check transaction isolation levels (REPEATABLE READ vs READ COMMITED)
        	return db.transaction(/*{ autocommit : false }*/).then(function(transaction) {
        		request.context.getTransaction = function() {
        			if (transaction.connection.uuid === transaction.id) {
        				return transaction;
        			}

        			throw new Error('No transaction available');
        		};

        		request.context.commit = function(callback) {
        			return transaction.commit().then(callback).catch(function(err) {
        				// Some conflict happened, commit has failed, should have rolled back
        				logger.error("COMMIT FAILED. Reason:", { route : request.path, error : err, stack : err.stack });
        				response.status(500).end();
        			});
        		};

        		request.context.rollback = function(callback) {
        			return transaction.rollback().then(callback).catch(function(err) {
        				// CRITICAL ERROR!!! A ROLLBACK CAN'T FAIL!!!
        				logger.error("CRITICAL!!! ROLLBACK FAILED. Reason:", { route : request.path, error : err, stack : err.stack });
        				response.status(500).end();
        			});
        		};

        		next();
        	}).catch(function(err) {
        		logger.error("Transaction creation failed!", { route : request.path, error : err, stack : err.stack });
        		response.status(500).end();
        	});
        },

        unhandledRequest : function(request, response) {
        	logger.error("Route was not handled:", request.originalUrl);

        	return request.context.rollback(function() { response.status(404).end(); });
        }
    };

};

module.exports = new APIMiddleware();
