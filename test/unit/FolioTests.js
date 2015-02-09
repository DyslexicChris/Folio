var expect = require('chai').expect;
var assert = require('chai').assert;
var sinon = require('sinon');
var Stubs = require('./Helpers/Stubs');
var Assertions = require('./Helpers/Assertions');
var mockery = require('mockery');


describe('Folio', function () {

    beforeEach(function () {

        this.RouteManager = Stubs.newFunction();
        this.RouteManager.prototype.reset = Stubs.newFunction();

        this.RouteMiddlewareManager = Stubs.newFunction();
        this.RouteMiddlewareManager.prototype.reset = Stubs.newFunction();

        this.RouteHandlerManager = Stubs.newFunction();
        this.RouteHandlerManager.prototype.reset = Stubs.newFunction();

        this.RequestHandler = Stubs.newFunction();
        this.ObjectDecorator = Stubs.newFunction();
        this.ObjectDecorator.prototype.addDecoration = Stubs.newFunction();

        this.SendObjectDecoration = Stubs.newFunction();

        this.HttpServer = Stubs.newFunction();
        this.HttpServer.prototype.start = Stubs.newFunction().callsArg(1);
        this.HttpServer.prototype.stop = Stubs.newFunction().callsArg(0);

        this.ProcessManager = Stubs.newFunction();
        this.ProcessManager.prototype.cluster = Stubs.newFunction();

        this.JSONBodyParserMiddleware = Stubs.newFunction();
        this.JSONBodyParserFactory = Stubs.newFunction();
        this.JSONBodyParserFactory.prototype.newMiddleware = Stubs.newFunction();
        this.JSONBodyParserFactory.prototype.newMiddleware.returns(this.JSONBodyParserMiddleware);

        this.middlewareCaninsterInstance = Stubs.newMiddlewareCaninster();
        this.MiddlewareCanister = Stubs.newFunction();
        this.MiddlewareCanister.new = Stubs.newFunction();
        this.MiddlewareCanister.new.returns(this.middlewareCaninsterInstance);

        this.routeCanisterInstance = {};
        this.RouteCanister = Stubs.newFunction();
        this.RouteCanister.new = Stubs.newFunction();
        this.RouteCanister.new.returns(this.routeCanisterInstance);

        mockery.deregisterAll();

        mockery.enable({
            warnOnReplace: false,
            useCleanCache: true
        });

        mockery.registerAllowable('../../lib/Folio', true);
        mockery.registerAllowable('underscore');
        mockery.registerMock('./RouteManager', this.RouteManager);
        mockery.registerMock('./RouteMiddlewareManager', this.RouteMiddlewareManager);
        mockery.registerMock('./RouteHandlerManager', this.RouteHandlerManager);
        mockery.registerMock('./RouteCanister', this.RouteCanister);
        mockery.registerMock('./MiddlewareCanister', this.MiddlewareCanister);
        mockery.registerMock('./HttpServer', this.HttpServer);
        mockery.registerMock('./RequestHandler', this.RequestHandler);
        mockery.registerMock('./ProcessManager', this.ProcessManager);
        mockery.registerMock('./middleware/JSONBodyParserFactory', this.JSONBodyParserFactory);
        mockery.registerMock('./decorators/ObjectDecorator', this.ObjectDecorator);
        mockery.registerMock('./decorators/response-decorations/SendObjectDecoration', this.SendObjectDecoration);

        this.Folio = require('../../lib/Folio');

    });

    describe('On new', function () {

        beforeEach(function () {

            this.folio = new this.Folio();

        });

        it('Should have a route manager', function () {

            expect(this.folio._routeManager).to.not.be.undefined;


        });

        it('Should have a route middleware manager', function () {

            expect(this.folio._routeMiddlewareManager).to.not.be.undefined;

        });

        it('Should have a route handler manager', function () {

            expect(this.folio._routeHandlerManager).to.not.be.undefined;

        });

        it('Should have a request handler', function () {

            expect(this.folio._requestHandler).to.not.be.undefined;

        });

        it('Should have a response decorator', function () {

            expect(this.folio._responseDecorator).to.not.be.undefined;

        });

        it('Should have a \'send object decoration\'', function () {

            expect(this.folio._sendObjectDecoration).to.not.be.undefined;

        });

        it('Should add the \'send object decoration\' to the response decorator', function () {

            assert(this.folio._responseDecorator.addDecoration.calledOnce);
            assert(this.folio._responseDecorator.addDecoration.calledWith(this.folio._sendObjectDecoration));

        });

        it('Should have a http server', function () {

            expect(this.folio._httpServer).to.not.be.undefined;

        });

        it('Should have a process manager', function () {

            expect(this.folio._processManager).to.not.be.undefined;

        });

        it('Should have a JSON Body Parser factory', function () {

            expect(this.folio._jsonBodyParserFactory).to.not.be.undefined;

        });

        describe('On use(middleware) with a single middleware', function () {

            beforeEach(function () {

                this.middlewareA = Stubs.newFunction();
                this.result = this.folio.use(this.middlewareA);

            });

            it('Should return a middleware canister', function () {

                expect(this.result).equal(this.middlewareCaninsterInstance);

            });

            it('The middleware should have been constructed correctly', function () {

                assert(this.MiddlewareCanister.new.calledOnce);

            });

            it('Should add the middleware to the middleware canister', function () {

                assert(this.middlewareCaninsterInstance.addMiddleware.calledOnce);
                assert(this.middlewareCaninsterInstance.addMiddleware.calledWith(this.middlewareA));

            });

        });

        describe('On use(middleware) with multiple middleware', function () {

            beforeEach(function () {

                this.middlewareA = Stubs.newFunction();
                this.middlewareB = Stubs.newFunction();

                this.result = this.folio.use(this.middlewareA, this.middlewareB);

            });

            it('Should return a middleware canister', function () {

                expect(this.result).equal(this.middlewareCaninsterInstance);

            });

            it('The middleware should have been constructed correctly', function () {

                assert(this.MiddlewareCanister.new.calledOnce);

            });

            it('Should add the middleware to the middleware canister', function () {

                assert(this.middlewareCaninsterInstance.addMiddleware.calledOnce);
                assert(this.middlewareCaninsterInstance.addMiddleware.calledWith(this.middlewareA, this.middlewareB));

            });

        });

        describe('On use(middleware) with no middleware', function () {

            it('Should throw an error', function () {

                Assertions.assertThrows(function () {
                    this.folio.use();
                }, 'No middleware supplied', this);

            });

        });

        describe('On get(specification)', function () {

            beforeEach(function () {

                this.result = this.folio.get('/test/specification');

            });

            it('A route canister should have been constructed correctly', function () {

                assert(this.RouteCanister.new.calledOnce);
                assert(this.RouteCanister.new.calledWith(
                    'GET',
                    '/test/specification',
                    this.folio._routeManager,
                    this.folio._routeMiddlewareManager,
                    this.folio._routeHandlerManager
                ));

            });

            it('Should return the route canister', function () {

                expect(this.result).to.deep.equal(this.routeCanisterInstance);

            });

        });

        describe('On post(specification)', function () {

            beforeEach(function () {

                this.result = this.folio.post('/test/specification');

            });

            it('A route canister should have been constructed correctly', function () {

                assert(this.RouteCanister.new.calledOnce);
                assert(this.RouteCanister.new.calledWith(
                    'POST',
                    '/test/specification',
                    this.folio._routeManager,
                    this.folio._routeMiddlewareManager,
                    this.folio._routeHandlerManager
                ));

            });

            it('Should return the route canister', function () {

                expect(this.result).to.deep.equal(this.routeCanisterInstance);

            });

        });

        describe('On put(specification)', function () {

            beforeEach(function () {

                this.result = this.folio.put('/test/specification');

            });

            it('A route canister should have been constructed correctly', function () {

                assert(this.RouteCanister.new.calledOnce);
                assert(this.RouteCanister.new.calledWith(
                    'PUT',
                    '/test/specification',
                    this.folio._routeManager,
                    this.folio._routeMiddlewareManager,
                    this.folio._routeHandlerManager
                ));

            });

            it('Should return the route canister', function () {

                expect(this.result).to.deep.equal(this.routeCanisterInstance);

            });

        });

        describe('On delete(specification)', function () {

            beforeEach(function () {

                this.result = this.folio.delete('/test/specification');

            });

            it('A route canister should have been constructed correctly', function () {

                assert(this.RouteCanister.new.calledOnce);
                assert(this.RouteCanister.new.calledWith(
                    'DELETE',
                    '/test/specification',
                    this.folio._routeManager,
                    this.folio._routeMiddlewareManager,
                    this.folio._routeHandlerManager
                ));

            });

            it('Should return the route canister', function () {

                expect(this.result).to.deep.equal(this.routeCanisterInstance);

            });

        });

        describe('On head(specification)', function () {

            beforeEach(function () {

                this.result = this.folio.head('/test/specification');

            });

            it('A route canister should have been constructed correctly', function () {

                assert(this.RouteCanister.new.calledOnce);
                assert(this.RouteCanister.new.calledWith(
                    'HEAD',
                    '/test/specification',
                    this.folio._routeManager,
                    this.folio._routeMiddlewareManager,
                    this.folio._routeHandlerManager
                ));

            });

            it('Should return the route canister', function () {

                expect(this.result).to.deep.equal(this.routeCanisterInstance);

            });

        });

        describe('On start(port, callback)', function () {

            beforeEach(function () {
                this.startCallback = Stubs.newFunction();
                this.folio.start(1234, this.startCallback);
            });

            it('Should delegate to the http server with the correct port', function () {
                assert(this.HttpServer.prototype.start.calledWithExactly(1234, sinon.match.any));
            });

            it('Should delegate to the http server with the correct completion function', function () {
                assert(this.HttpServer.prototype.start.calledWithExactly(sinon.match.any, this.startCallback));
            });
        });

        describe('On stop(callback)', function () {

            beforeEach(function () {
                this.stopCallback = Stubs.newFunction();
                this.folio.stop(this.stopCallback);
            });

            it('Should delegate to the http server with the correct completion function', function () {
                assert(this.HttpServer.prototype.stop.calledWithExactly(this.stopCallback));
            });
        });


        describe('On cluster(clusterizedFunction)', function () {

            beforeEach(function () {
                this.clusterizeFunction = Stubs.newFunction();
                this.folio.cluster(this.clusterizeFunction);
            });

            it('Should delegate to the processManager', function () {
                assert(this.ProcessManager.prototype.cluster.calledOnce);
                assert(this.ProcessManager.prototype.cluster.calledWithExactly(this.clusterizeFunction));
            });

        });

        describe('On jsonBodyParser()', function () {

            beforeEach(function () {

                this.middleware = this.folio.jsonBodyParser();

            });

            it('Should delegate to the JSON Body Parser factory', function () {

                expect(this.JSONBodyParserFactory.prototype.newMiddleware.callCount).to.equal(1);

            });

            it('Return the middleware returned by the JSON Body Parser factory', function () {

                expect(this.middleware).to.deep.equal(this.JSONBodyParserMiddleware);

            });

        });

        describe('On reset()', function () {

            beforeEach(function () {

                this.folio.reset();

            });

            it('Should reset the route manager', function () {

                assert(this.folio._routeManager.reset.calledOnce);

            });

            it('Should reset the route middleware manager', function () {

                assert(this.folio._routeMiddlewareManager.reset.calledOnce);

            });

            it('Should reset the route handler manager', function () {

                assert(this.folio._routeHandlerManager.reset.calledOnce);

            });

        });

    });

});
