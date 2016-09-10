var rekuire = require('rekuire');
var rollback = rekuire('persistence-utils/rollback');
var commit = rekuire('persistence-utils/commit');

var _ = require('lodash');

var testMiddlewareFunction = function(middlewareFn) {
    if (!_.isFunction(middlewareFn)) {
        throw new Error('Transactional setup failed. middlewareFn passed is not a funcion.');
    }
};

var Transactional = function(middlewareFn) {
    testMiddlewareFunction(middlewareFn);

    return function(request, response) {
        return middlewareFn(request, response)
            .then(commit(request, response))
            .catch(rollback(request, response));
    };
};

Transactional.rollbackOnly = function(middlewareFn) {
    testMiddlewareFunction(middlewareFn);

    return function(request, response, next) {
        return middlewareFn(request, response, next)
            .catch(rollback(request, response));
    };
};

module.exports = Transactional;
