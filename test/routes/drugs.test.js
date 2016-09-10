var rekuire = require('rekuire');
var proxyquire = require('proxyquire');
var sinon = require('sinon');

var expect = require('chai').expect;

var fnMap = {
    getAllDrugs : 'getAllDrugs',
    getDrug : 'getDrug',
    createDrug : 'createDrug',
    updateDrug : 'updateDrug',
    deleteDrug : 'deleteDrug'
};

describe('drug endpoints tests', function() {
    var router;
    var dependencyMocks;

    beforeEach(function() {
        dependencyMocks = {};

        dependencyMocks[ rekuire.path('middleware/Transactional') ] = function(arg) { return arg; };
        dependencyMocks[ rekuire.path('middleware/drugs') ] = fnMap;

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
        proxyquire( rekuire.path('routes/drugs'), dependencyMocks);

        expect(router.get.calledWith('/', fnMap.getAllDrugs)).to.equal(true);
        expect(router.get.calledWith('/:id', fnMap.getDrug)).to.equal(true);
        expect(router.put.calledWith('/:id', fnMap.updateDrug)).to.equal(true);
        expect(router.post.calledWith('/', fnMap.createDrug)).to.equal(true);
        expect(router.delete.calledWith('/:id', fnMap.deleteDrug)).to.equal(true);
    });
});
