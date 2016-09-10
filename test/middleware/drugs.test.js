var rekuire = require('rekuire');
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var expressMocks = require('express-mocks-http');
var Promise = require('bluebird');

var expect = require('chai').expect;

var DrugsMiddlewarePath = rekuire.path('middleware/drugs');
var DrugMapperPath = rekuire.path('mappers/DrugMapper');
var DrugServicePath = rekuire.path('services/DrugService');

describe('drugs middleware tests', function() {
    var DrugsMiddleware;
    var drugServiceConstructorCall;
    var DrugMapper;
    var DrugServiceInstance;
    var request, response;
    var context = 'aContext', serviceResult = Promise.resolve('aServiceResult'), mappedResult = 'aMappedResult';
    var drugID = 'aDrugID', requestBody = 'aRequestBody';

    beforeEach(function() {
        var dependencyMocks = {};

        request = expressMocks.createRequest();
        response = expressMocks.createResponse();

        request.context = context;

        DrugServiceInstance = { };

        DrugMapper = { map : sinon.stub().withArgs(serviceResult).returns(mappedResult) };

        drugServiceConstructorCall = sinon.stub().withArgs(request.context).returns(DrugServiceInstance);

        dependencyMocks[ DrugServicePath ] = drugServiceConstructorCall;
        dependencyMocks[ DrugMapperPath ] = DrugMapper;

        DrugsMiddleware = proxyquire( DrugsMiddlewarePath, dependencyMocks );
    });

    it('gets all drugs', function() {
        DrugServiceInstance.getAllDrugs = sinon.stub().returns(serviceResult);

        return DrugsMiddleware.getAllDrugs(request, response).then(function(result) {
            expect(result).to.equal(mappedResult);
        });
    });

    it('gets some drug', function() {
        request.params = { id : drugID };

        DrugServiceInstance.getDrug = sinon.stub().withArgs(drugID).returns(serviceResult);

        return DrugsMiddleware.getDrug(request, response).then(function(result) {
            expect(result).to.equal(mappedResult);
        });
    });

    it('updates some drug', function() {
        request.params = { id : drugID };
        request.body = requestBody;

        DrugServiceInstance.updateDrug = sinon.stub().withArgs(drugID, requestBody).returns(serviceResult);

        return DrugsMiddleware.updateDrug(request, response).then(function(result) {
            expect(result).to.equal(mappedResult);
        });
    });

    it('creates a drug', function() {
        request.body = requestBody;

        DrugServiceInstance.createDrug = sinon.stub().withArgs(requestBody).returns(serviceResult);

        return DrugsMiddleware.createDrug(request, response).then(function(result) {
            expect(result).to.equal(mappedResult);
        });
    });

    it('deletes some drug', function() {
        request.params = { id : drugID };

        DrugServiceInstance.deleteDrug = sinon.stub().withArgs(drugID).returns( Promise.resolve() );

        return DrugsMiddleware.deleteDrug(request, response).then(function(res) {
            expect(res).to.deep.equal({});
        });
    });

});
