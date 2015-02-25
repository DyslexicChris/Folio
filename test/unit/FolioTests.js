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

        this.HttpServer = Stubs.newFunction();
        this.HttpServer.prototype.start = Stubs.newFunction().callsArg(1);
        this.HttpServer.prototype.stop = Stubs.newFunction().callsArg(0);

        this.middlewareCaninsterInstance = Stubs.newMiddlewareCaninster();
        this.MiddlewareCanister = Stubs.newFunction();
        this.MiddlewareCanister.new = Stubs.newFunction();
        this.MiddlewareCanister.new.returns(this.middlewareCaninsterInstance);

        this.routeCanisterInstance = {};
        this.RouteCanister = Stubs.newFunction();
        this.RouteCanister.new = Stubs.newFunction();
        this.RouteCanister.new.returns(this.routeCanisterInstance);


        this.mockRequestDecorator = Stubs.newDecorator();
        this.mockResponseDecorator = Stubs.newDecorator();

        this.ObjectDecoratorFactory = Stubs.newFunction();
        this.ObjectDecoratorFactory.prototype.requestDecorator = Stubs.newFunction().returns(this.mockRequestDecorator);
        this.ObjectDecoratorFactory.prototype.responseDecorator = Stubs.newFunction().returns(this.mockResponseDecorator);

        this.ObjectDecorationFactory = Stubs.newFunction();
        this.ObjectDecorationFactory.prototype.renderViewDecoration = Stubs.newFunction();

        this.CoreMiddlewareFactory = Stubs.newFunction();

        mockery.deregisterAll();

        mockery.enable({
            warnOnReplace: false,
            useCleanCache: true
        });

        mockery.registerAllowable('../../lib/Folio', true);
        mockery.registerAllowable('./constants/HTTPConstants', true);
        mockery.registerMock('./RouteManager', this.RouteManager);
        mockery.registerMock('./RouteMiddlewareManager', this.RouteMiddlewareManager);
        mockery.registerMock('./RouteHandlerManager', this.RouteHandlerManager);
        mockery.registerMock('./RouteCanister', this.RouteCanister);
        mockery.registerMock('./MiddlewareCanister', this.MiddlewareCanister);
        mockery.registerMock('./HttpServer', this.HttpServer);
        mockery.registerMock('./RequestHandler', this.RequestHandler);
        mockery.registerMock('./decorators/ObjectDecoratorFactory', this.ObjectDecoratorFactory);
        mockery.registerMock('./decorators/ObjectDecorationFactory', this.ObjectDecorationFactory);
        mockery.registerMock('./middleware/CoreMiddlewareFactory', this.CoreMiddlewareFactory);

        this.Folio = require('../../lib/Folio');

    });

    describe('On new', function () {

        beforeEach(function () {

            this.folio = new this.Folio();

        });

        it('Should have a route manager', function () {

            expect(this.folio.routeManager).to.not.be.undefined;


        });

        it('Should have a route middleware manager', function () {

            expect(this.folio.routeMiddlewareManager).to.not.be.undefined;

        });

        it('Should have a route handler manager', function () {

            expect(this.folio.routeHandlerManager).to.not.be.undefined;

        });

        it('Should have a request handler', function () {

            expect(this.folio.requestHandler).to.not.be.undefined;

        });

        it('Should have an object decoration factory', function () {

            expect(this.folio.objectDecorationFactory).to.not.be.undefined;

        });

        it('Should have an object decorator factory', function () {

            expect(this.folio.objectDecoratorFactory).to.not.be.undefined;

        });

        it('Should have a response decorator', function () {

            expect(this.folio.responseDecorator).to.not.be.undefined;

        });

        it('Should have a request decorator', function () {

            expect(this.folio.requestDecorator).to.not.be.undefined;

        });

        it('Should have a http server', function () {

            expect(this.folio.httpServer).to.not.be.undefined;

        });

        it('Should have a middleware factory', function () {

            expect(this.folio.middlewareFactory).to.not.be.undefined;

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
                    this.folio.routeManager,
                    this.folio.routeMiddlewareManager,
                    this.folio.routeHandlerManager
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
                    this.folio.routeManager,
                    this.folio.routeMiddlewareManager,
                    this.folio.routeHandlerManager
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
                    this.folio.routeManager,
                    this.folio.routeMiddlewareManager,
                    this.folio.routeHandlerManager
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
                    this.folio.routeManager,
                    this.folio.routeMiddlewareManager,
                    this.folio.routeHandlerManager
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
                    this.folio.routeManager,
                    this.folio.routeMiddlewareManager,
                    this.folio.routeHandlerManager
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

        describe('On setRenderEngine(renderEngine)', function () {

            describe('First call', function () {

                beforeEach(function () {

                    this.folio.responseDecorator.addDecoration.reset();
                    this.mockRenderEngine = {};
                    this.folio.setRenderEngine(this.mockRenderEngine);

                });

                it('Should set the render engine', function () {

                    expect(this.folio.getRenderEngine()).to.not.be.undefined;

                });

                it('It should add a render view decoration to the response decorator', function () {

                    assert(this.folio.responseDecorator.addDecoration.calledOnce);

                });

            });

            describe('Subsequent calls', function () {

                beforeEach(function () {

                    this.folio.responseDecorator.addDecoration.reset();
                    this.mockRenderEngine = {};
                    this.folio.setRenderEngine(this.mockRenderEngine);

                });

                it('Should throw', function () {

                    Assertions.assertThrows(function () {

                        this.folio.setRenderEngine(this.mockRenderEngine);

                    }, 'Render engine already set', this);

                });

            });


        });

        describe('On reset()', function () {

            beforeEach(function () {

                this.folio.reset();

            });

            it('Should reset the route manager', function () {

                assert(this.folio.routeManager.reset.calledOnce);

            });

            it('Should reset the route middleware manager', function () {

                assert(this.folio.routeMiddlewareManager.reset.calledOnce);

            });

            it('Should reset the route handler manager', function () {

                assert(this.folio.routeHandlerManager.reset.calledOnce);

            });

        });

    });

});
