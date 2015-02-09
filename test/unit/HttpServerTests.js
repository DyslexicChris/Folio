var expect = require('chai').expect;
var assert = require('chai').assert;
var sinon = require('sinon');
var Stubs = require('./Helpers/Stubs');
var mockery = require('mockery');


describe('HttpServer', function () {

    beforeEach(function () {

        this.mockDomain = Stubs.newDomain();
        this.mockServer = Stubs.newHTTPServer();

        this.mockHttp = Stubs.HTTPModule();
        this.mockHttp.createServer.returns(this.mockServer);

        this.mockLogger = Stubs.newLogger();
        this.mockLoggerModule = Stubs.LoggerModule();
        this.mockLoggerModule.getLogger.returns(this.mockLogger);

        mockery.enable({
            warnOnReplace: false,
            useCleanCache: true
        });

        mockery.registerAllowable('../../lib/HttpServer', true);
        mockery.registerAllowable('underscore');
        mockery.registerMock('domain', this.mockDomain);
        mockery.registerMock('http', this.mockHttp);
        mockery.registerMock('./Logger', this.mockLoggerModule);

        this.HttpServer = require('../../lib/HttpServer');

    });

    afterEach(function () {

        mockery.disable();

    });

    describe('On new', function () {

        beforeEach(function () {

            this.mockRequestHandler = Stubs.newRequestHandler();
            this.httpServer = new this.HttpServer(this.mockRequestHandler);

        });

        it('Should not be null', function () {

            expect(this.httpServer).to.not.be.null;

        });

        describe('On start(port, callback)', function () {

            beforeEach(function () {

                this.startCallback = Stubs.newFunction();
                this.httpServer.start(1234, this.startCallback);

            });

            it('Should create a server, have it listen on the given port and supply it with a completion callback', function () {

                assert(this.mockHttp.createServer.calledOnce);
                assert(this.mockServer.listen.calledOnce);
                assert(this.mockServer.listen.calledWithExactly(1234, this.startCallback));

            });

            describe('On stop(callback)', function(){

                beforeEach(function(){

                    this.stopCallback = Stubs.newFunction();
                    this.httpServer.stop(this.stopCallback);

                });

                it('Should close the http server', function(){

                    assert(this.mockServer.close.calledOnce);

                });

                it('Should call the given callback when done', function(){

                    this.mockServer.close.callArg(0);
                    assert(this.stopCallback.calledOnce);

                });

            });

            describe('When handling requests', function () {

                beforeEach(function () {

                    this.mockRequest = Stubs.newRequest();
                    this.mockResponse = Stubs.newResponse();

                    this.mockHttp.createServer.callArgWith(0, this.mockRequest, this.mockResponse);

                });

                it('Should create a new domain', function () {

                    assert(this.mockDomain.create.calledOnce);

                });

                it('Should set the error callback on the domain', function () {

                    assert(this.mockDomain.on.calledOnce);
                    assert(this.mockDomain.on.calledWithExactly('error', sinon.match.any));

                });

                it('Should add the request to the domain', function () {

                    assert(this.mockDomain.add.calledWithExactly(this.mockRequest));

                });

                it('Should add the response to the domain', function () {

                    assert(this.mockDomain.add.calledWithExactly(this.mockResponse));

                });

                it('Should add the server to the domain', function () {

                    assert(this.mockDomain.add.calledWithExactly(this.mockServer));

                });

                it('Should run the domain - which should delegate to the request handler', function () {

                    assert(this.mockDomain.run.calledOnce);
                    assert(this.mockRequestHandler.handle.calledOnce);

                });

                describe('When the error callback is called', function () {

                    beforeEach(function () {

                        var thisTest = this;

                        var domainError = {
                            message: 'test',
                            stack: 'testStack',
                            domain: {
                                members: [
                                    'test',
                                    thisTest.mockResponse,
                                    thisTest.mockServer
                                ]
                            }
                        };

                        this.mockDomain.on.callArgWith(1, domainError);

                    });

                    it('Should gracefully shut down the server', function () {

                        assert(this.mockServer.close.calledOnce);

                    });

                    it('Should send a 500 response', function () {

                        assert(this.mockResponse.writeHead.calledOnce);
                        assert(this.mockResponse.writeHead.calledWithExactly(500, {'Connection': 'close'}));
                        assert(this.mockResponse.end.calledOnce);

                    });

                });

            });

        });

    });

});
