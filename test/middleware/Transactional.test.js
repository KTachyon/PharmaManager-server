var expressMocks = require('express-mocks-http');
var rekuire = require('rekuire');
var proxyquire = require('proxyquire');

var Promise = require('bluebird');

var sinon = require('sinon');
var expect = require('chai').expect;

var commitPath = rekuire.path('persistence-utils/commit');
var rollbackPath = rekuire.path('persistence-utils/rollback');

describe('Transactional commit and rollback calls', function() {
    it('it calls commit after middleware fulfills', function() {
        var dependencyMocks = {};

        var rollbackCallStub = sinon.stub().returns(Promise.resolve());
        var commitCallStub = sinon.stub().returns(Promise.resolve());

        dependencyMocks[rollbackPath] = sinon.stub().returns(function() { return rollbackCallStub(); });
        dependencyMocks[commitPath] = sinon.stub().returns(function() { return commitCallStub(); });

        var Transactional = proxyquire(rekuire.path('middleware/Transactional'), dependencyMocks);
        var stubMiddleware = sinon.stub().returns(Promise.resolve());

        var request = expressMocks.createRequest();
        var response = expressMocks.createResponse();

        return Transactional(stubMiddleware)(request, response).then(function() {
            expect(stubMiddleware.called).to.equal(true);
            expect(dependencyMocks[rollbackPath].calledWith(request, response)).to.equal(true);
            expect(dependencyMocks[commitPath].calledWith(request, response)).to.equal(true);
            expect(!rollbackCallStub.called).to.equal(true);
            expect(commitCallStub.called).to.equal(true);
        });
    });

    it('it calls rollback if commit fails', function() {
        var dependencyMocks = {};

        var rollbackCallStub = sinon.stub().returns(Promise.resolve());
        var commitCallStub = sinon.stub().returns(Promise.reject());

        dependencyMocks[rollbackPath] = sinon.stub().returns(function() { return rollbackCallStub(); });
        dependencyMocks[commitPath] = sinon.stub().returns(function() { return commitCallStub(); });

        var Transactional = proxyquire(rekuire.path('middleware/Transactional'), dependencyMocks);
        var stubMiddleware = sinon.stub().returns(Promise.resolve());

        var request = expressMocks.createRequest();
        var response = expressMocks.createResponse();

        return Transactional(stubMiddleware)(request, response).then(function() {
            expect(stubMiddleware.called).to.equal(true);
            expect(dependencyMocks[rollbackPath].calledWith(request, response)).to.equal(true);
            expect(dependencyMocks[commitPath].calledWith(request, response)).to.equal(true);
            expect(rollbackCallStub.called).to.equal(true);
            expect(commitCallStub.called).to.equal(true);
        });
    });

    it('it calls rollback after middleware rejects', function() {
        var dependencyMocks = {};

        var rollbackCallStub = sinon.stub().returns(Promise.resolve());
        var commitCallStub = sinon.stub().returns(Promise.resolve());

        dependencyMocks[rollbackPath] = sinon.stub().returns(function() { return rollbackCallStub(); });
        dependencyMocks[commitPath] = sinon.stub().returns(function() { return commitCallStub(); });

        var Transactional = proxyquire(rekuire.path('middleware/Transactional'), dependencyMocks);
        var stubMiddleware = sinon.stub().returns(Promise.reject());

        var request = expressMocks.createRequest();
        var response = expressMocks.createResponse();

        return Transactional(stubMiddleware)(request, response).then(function() {
            /*jshint expr:true */
            expect(stubMiddleware.called).to.be.ok;
            expect(dependencyMocks[rollbackPath].calledWith(request, response)).to.be.ok;
            expect(dependencyMocks[commitPath].calledWith(request, response)).to.be.ok;
            expect(rollbackCallStub.called).to.be.ok;
            expect(commitCallStub.called).to.not.be.ok;
            /*jshint expr:false */
        });
    });

    it('it calls rollback on rollbackOnly after middleware rejects', function() {
        var dependencyMocks = {};

        var rollbackCallStub = sinon.stub().returns(Promise.resolve());
        var commitCallStub = sinon.stub().returns(Promise.resolve());

        dependencyMocks[rollbackPath] = sinon.stub().returns(function() { return rollbackCallStub(); });
        dependencyMocks[commitPath] = sinon.stub().returns(function() { return commitCallStub(); });

        var Transactional = proxyquire(rekuire.path('middleware/Transactional'), dependencyMocks);
        var stubMiddleware = sinon.stub().returns(Promise.reject());

        var request = expressMocks.createRequest();
        var response = expressMocks.createResponse();

        return Transactional.rollbackOnly(stubMiddleware)(request, response).then(function() {
            expect(stubMiddleware.called).to.equal(true);
            expect(dependencyMocks[rollbackPath].calledWith(request, response)).to.equal(true);
            expect(dependencyMocks[commitPath].calledWith(request, response)).to.equal(false);
            expect(rollbackCallStub.called).to.equal(true);
            expect(commitCallStub.called).to.equal(false);
        });
    });

    it('it won\'t call rollback on rollbackOnly after middleware resolve', function() {
        var dependencyMocks = {};

        var rollbackCallStub = sinon.stub().returns(Promise.resolve());
        var commitCallStub = sinon.stub().returns(Promise.resolve());

        dependencyMocks[rollbackPath] = sinon.stub().returns(function() { return rollbackCallStub(); });
        dependencyMocks[commitPath] = sinon.stub().returns(function() { return commitCallStub(); });

        var Transactional = proxyquire(rekuire.path('middleware/Transactional'), dependencyMocks);
        var stubMiddleware = sinon.stub().returns(Promise.resolve());

        var request = expressMocks.createRequest();
        var response = expressMocks.createResponse();

        return Transactional.rollbackOnly(stubMiddleware)(request, response).then(function() {
            expect(stubMiddleware.called).to.equal(true);
            expect(dependencyMocks[rollbackPath].calledWith(request, response)).to.equal(true);
            expect(dependencyMocks[commitPath].calledWith(request, response)).to.equal(false);
            expect(rollbackCallStub.called).to.equal(false);
            expect(commitCallStub.called).to.equal(false);
        });
    });

    it('will throw an error if the parameter is not a function', function() {
        var dependencyMocks = {};

        var rollbackCallStub = sinon.stub().returns(Promise.resolve());
        var commitCallStub = sinon.stub().returns(Promise.resolve());

        dependencyMocks[rollbackPath] = sinon.stub().returns(function() { return rollbackCallStub(); });
        dependencyMocks[commitPath] = sinon.stub().returns(function() { return commitCallStub(); });

        var Transactional = proxyquire(rekuire.path('middleware/Transactional'), dependencyMocks);
        var stubMiddleware = 'not a function';

        var request = expressMocks.createRequest();
        var response = expressMocks.createResponse();

        var testCall = function() { Transactional.rollbackOnly(stubMiddleware)(request, response); };

        expect(testCall).to.throw(Error);
    });
});
