var rekuire = require('rekuire');
var proxyquire = require('proxyquire');
var sinon = require('sinon');

var expect = require('chai').expect;

var fnMap = {
    setupCrossDomain : 'setupCrossDomain',
    transaction : 'transaction',
    unhandledRequest : 'unhandledRequest'
};

describe('api routes/endpoints tests', function() {
    var router;
    var dependencyMocks;
    var patientsRouter = { isA : 'patientsRouter' }, drugsRouter = { isA : 'drugsRouter' };

    beforeEach(function() {
        dependencyMocks = {};

        dependencyMocks[ rekuire.path('middleware/api') ] = fnMap;
        dependencyMocks[ rekuire.path('routes/patients') ] = patientsRouter;
        dependencyMocks[ rekuire.path('routes/drugs') ] = drugsRouter;

        router = { use : sinon.stub() };

        dependencyMocks.express = {
            Router : function() { return router; }
        };
    });

    it('assigns all endpoints to the correct middleware functions', function() {
        proxyquire( rekuire.path('routes/api'), dependencyMocks);

        expect(router.use.calledWith(fnMap.setupCrossDomain)).to.equal(true);
        expect(router.use.calledWith(fnMap.transaction)).to.equal(true);
        expect(router.use.calledWith('/patients', patientsRouter)).to.equal(true);
        expect(router.use.calledWith('/drugs', drugsRouter)).to.equal(true);
        expect(router.use.calledWith(fnMap.unhandledRequest)).to.equal(true);
    });
});
