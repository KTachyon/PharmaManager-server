var rekuire = require('rekuire');
var proxyquire = require('proxyquire');
var sinon = require('sinon');

var expect = require('chai').expect;

var fnMap = {
    getAllPatients : 'getAllPatients',
    getPatient : 'getPatient',
    createPatient : 'createPatient',
    updatePatient : 'updatePatient',
    deletePatient : 'deletePatient'
};

describe('patient endpoints tests', function() {
    var router;
    var dependencyMocks;

    beforeEach(function() {
        dependencyMocks = {};

        dependencyMocks[ rekuire.path('middleware/Transactional') ] = function(arg) { return arg; };
        dependencyMocks[ rekuire.path('middleware/patients') ] = fnMap;

        router = {
            get : sinon.stub(),
            post : sinon.stub(),
            put : sinon.stub(),
            delete : sinon.stub()
        };

        dependencyMocks.express = {
            Router : function() { return router; }
        };
    });

    it('assigns all endpoints to the correct middleware functions', function() {
        proxyquire( rekuire.path('routes/patients'), dependencyMocks);

        expect(router.get.calledWith('/', fnMap.getAllPatients)).to.equal(true);
        expect(router.get.calledWith('/:id', fnMap.getPatient)).to.equal(true);
        expect(router.put.calledWith('/:id', fnMap.updatePatient)).to.equal(true);
        expect(router.post.calledWith('/', fnMap.createPatient)).to.equal(true);
        expect(router.delete.calledWith('/:id', fnMap.deletePatient)).to.equal(true);
    });
});
