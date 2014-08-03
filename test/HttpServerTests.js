var _ = require('underscore');
var expect = require('chai').expect;
var sinon = require('sinon');
var mockery = require('mockery');


describe('HttpServer', function () {

    beforeEach(function () {

        var thisTest = this;

        this.spies = {};

        this.mockDomain = {
            create: function () {
                return this;
            },
            on: function () {
            },
            add: function () {
            },
            run: function (callback) {
                callback();
            }
        };

        this.spies.mockDomainCreate = sinon.spy(this.mockDomain, 'create');
        this.spies.mockDomainOn = sinon.spy(this.mockDomain, 'on');
        this.spies.mockDomainAdd = sinon.spy(this.mockDomain, 'add');
        this.spies.mockDomainRun = sinon.spy(this.mockDomain, 'run');

        this.mockServer = {
            listen: function () {
            },
            close: function(){
            }
        };

        this.spies.mockServerListen = sinon.spy(this.mockServer, 'listen');
        this.spies.mockServerClose = sinon.spy(this.mockServer, 'close');

        this.mockHttp = {
            createServer: function () {
                return thisTest.mockServer;
            }
        };

        this.spies.mockHttpCreateServer = sinon.spy(this.mockHttp, 'createServer');

        this.mockLogger = {
            log: function () {
            },
            error: function () {
            },
            warn: function () {
            }
        };


        mockery.deregisterAll();

        mockery.enable({
            warnOnReplace: false,
            useCleanCache: true
        });


        mockery.registerAllowable('../lib/HttpServer', true);
        mockery.registerAllowable('underscore');
        mockery.registerMock('domain', this.mockDomain);
        mockery.registerMock('http', this.mockHttp);
        mockery.registerMock('./Logger', this.mockLogger);


        this.HttpServer = require('../lib/HttpServer');


    });

    afterEach(function () {
        _.each(this.spies, function (spy) {
            spy.restore();
        })
    });

    describe('On new', function () {

        beforeEach(function () {

            this.mockRequestHandler =  {
                object: 'mockRequestHandler',
                handle: function(){}
            };

            this.spies.requestHandlerHandle = sinon.spy(this.mockRequestHandler, 'handle');
            this.httpServer = new this.HttpServer(this.mockRequestHandler);

        });

        it('Should not be null', function () {

            expect(this.httpServer).to.not.be.null;

        });

        it('Should have the given request handler', function () {

            expect(this.httpServer._requestHandler).to.deep.equal(this.mockRequestHandler);

        });

        describe('On start(port)', function () {

            beforeEach(function () {

                this.httpServer.start(1234);

            });

            it('Should create a server an have it listen on the given port (1234)', function () {

                expect(this.mockHttp.createServer.callCount).to.equal(1);
                expect(this.mockServer.listen.callCount).to.equal(1);
                expect(this.mockServer.listen.getCall(0).args[0]).to.equal(1234);

            });

            describe('When handling requests', function () {

                beforeEach(function () {


                    this.mockRequest = {
                        object: 'mockRequest'
                    };

                    this.mockResponse = {
                        object: 'mockResponse',
                        writeHead: function(){
                        },
                        end: function(){
                        }
                    };

                    this.spies.mockResponseWriteHead = sinon.spy(this.mockResponse, 'writeHead');
                    this.spies.mockResponseWriteEnd = sinon.spy(this.mockResponse, 'end');

                    var requestCallback = this.mockHttp.createServer.getCall(0).args[0];
                    requestCallback(this.mockRequest, this.mockResponse);

                });

                it('Should create a new domain', function () {

                    expect(this.mockDomain.create.callCount).to.equal(1);

                });

                it('Should set the error callback on the domain', function () {

                    expect(this.mockDomain.on.callCount).to.equal(1);
                    expect(this.mockDomain.on.getCall(0).args[0]).to.equal('error');

                });

                it('Should add the request to the domain', function () {

                    expect(this.mockDomain.add.getCall(0).args[0]).to.deep.equal(this.mockRequest);

                });

                it('Should add the response to the domain', function () {

                    expect(this.mockDomain.add.getCall(1).args[0]).to.deep.equal(this.mockResponse);

                });

                it('Should add the server to the domain', function () {

                    expect(this.mockDomain.add.getCall(2).args[0]).to.deep.equal(this.mockServer);

                });

                it('Should run the domain - which should delegate to the request handler', function () {

                    expect(this.mockDomain.run.callCount).to.equal(1);
                    expect(this.mockRequestHandler.handle.callCount).to.equal(1);

                });

                describe('When the error callback is called', function(){

                    beforeEach(function(){

                        var thisTest = this;

                        var domainError = {
                            message: 'test',
                            stack: 'testStack',
                            domain: {
                                members:[
                                    'test',
                                    thisTest.mockResponse,
                                    thisTest.mockServer
                                ]
                            }
                        };

                        var callback = this.mockDomain.on.getCall(0).args[1];
                        callback(domainError);
                    });

                    it('Should gracefully shut down the server', function(){

                        expect(this.mockServer.close.callCount).to.equal(1);

                    });

                    it('Should send a 500 response', function(){

                        expect(this.mockResponse.writeHead.callCount).to.equal(1);
                        expect(this.mockResponse.writeHead.getCall(0).args).to.deep.equal([500, {'Connection': 'close'}]);
                        expect(this.mockResponse.end.callCount).to.equal(1);

                    });

                });

            });

        });

    });

});
