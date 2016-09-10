var rekuire = require('rekuire');
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var expressMocks = require('express-mocks-http');
var Promise = require('bluebird');

var expect = require('chai').expect;

var PatientsMiddlewarePath = rekuire.path('middleware/patients');
var PatientMapperPath = rekuire.path('mappers/PatientMapper');
var PatientServicePath = rekuire.path('services/PatientService');

describe('patients middleware tests', function() {
    var PatientsMiddleware;
    var patientServiceConstructorCall;
    var PatientMapper;
    var PatientServiceInstance;
    var request, response;
    var context = 'aContext', serviceResult = Promise.resolve('aServiceResult'), mappedResult = 'aMappedResult';
    var patientID = 'aPatientID', requestBody = 'aRequestBody';

    beforeEach(function() {
        var dependencyMocks = {};

        request = expressMocks.createRequest();
        response = expressMocks.createResponse();

        request.context = context;

        PatientServiceInstance = { };

        PatientMapper = { map : sinon.stub().withArgs(serviceResult).returns(mappedResult) };

        patientServiceConstructorCall = sinon.stub().withArgs(request.context).returns(PatientServiceInstance);

        dependencyMocks[ PatientServicePath ] = patientServiceConstructorCall;
        dependencyMocks[ PatientMapperPath ] = PatientMapper;

        PatientsMiddleware = proxyquire( PatientsMiddlewarePath, dependencyMocks );
    });

    it('gets all patients', function() {
        PatientServiceInstance.getAllPatients = sinon.stub().returns(serviceResult);

        return PatientsMiddleware.getAllPatients(request, response).then(function(result) {
            expect(result).to.equal(mappedResult);
        });
    });

    it('gets some patient', function() {
        request.params = { id : patientID };

        PatientServiceInstance.getPatient = sinon.stub().withArgs(patientID).returns(serviceResult);

        return PatientsMiddleware.getPatient(request, response).then(function(result) {
            expect(result).to.equal(mappedResult);
        });
    });

    it('updates some patient', function() {
        request.params = { id : patientID };
        request.body = requestBody;

        PatientServiceInstance.updatePatient = sinon.stub().withArgs(patientID, requestBody).returns(serviceResult);

        return PatientsMiddleware.updatePatient(request, response).then(function(result) {
            expect(result).to.equal(mappedResult);
        });
    });

    it('creates a patient', function() {
        request.body = requestBody;

        PatientServiceInstance.createPatient = sinon.stub().withArgs(requestBody).returns(serviceResult);

        return PatientsMiddleware.createPatient(request, response).then(function(result) {
            expect(result).to.equal(mappedResult);
        });
    });

    it('deletes some patient', function() {
        request.params = { id : patientID };

        PatientServiceInstance.deletePatient = sinon.stub().withArgs(patientID).returns( Promise.resolve() );

        return PatientsMiddleware.deletePatient(request, response).then(function(res) {
            expect(res).to.deep.equal({});
        });
    });

});
