var expect = require('chai').expect;
var assert = require('chai').assert;
var sinon = require('sinon');
var Stubs = require('./Helpers/Stubs');
var Assertions = require('./Helpers/Assertions');
var mockery = require('mockery');


describe('Folio', function () {

    beforeEach(function () {

        this.testRoute = {object:'route'};
        this.RouteResolver = Stubs.newFunction();
        this.RouteFactory = Stubs.newFunction();
        this.RouteFactory.prototype.buildRoute = Stubs.newFunction().returns(this.testRoute);

        this.RouteSpecificationParser = Stubs.newFunction();
        this.RouteRegistry = Stubs.newFunction();
        this.RouteRegistry.prototype.reset = Stubs.newFunction();

        this.RouteMiddlewareRegistry = Stubs.newFunction();
        this.RouteMiddlewareRegistry.prototype.reset = Stubs.newFunction();

        this.RouteHandlerRegistry = Stubs.newFunction();
        this.RouteHandlerRegistry.prototype.reset = Stubs.newFunction();

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


//        var RouteMiddlewareRegistry = require('./registries/RouteMiddlewareRegistry');
//        var RouteHandlerRegistry = require('./registries/RouteHandlerRegistry');
//        var ObjectDecoratorFactory = require('./decorators/ObjectDecoratorFactory');
//        var ObjectDecorationFactory = require('./decorators/ObjectDecorationFactory');
//        var RouteCanister = require('./canisters/RouteCanister');
//        var MiddlewareCanister = require('./canisters/MiddlewareCanister');
//        var HttpServer = require('./HttpServer');
//        var RequestHandler = require('./RequestHandler');
//        var CoreMiddlewareFactory = require('./middleware/CoreMiddlewareFactory');
//        var HTTPConstants = require('./constants/HTTPConstants');

        mockery.registerAllowable('../../lib/Folio', true);
        mockery.registerAllowable('./constants/HTTPConstants', true);
        mockery.registerMock('./RouteResolver', this.RouteResolver);
        mockery.registerMock('./RouteFactory', this.RouteFactory);
        mockery.registerMock('./RouteSpecificationParser', this.RouteSpecificationParser);
        mockery.registerMock('./registries/RouteRegistry', this.RouteRegistry);


        mockery.registerMock('./registries/RouteMiddlewareRegistry', this.RouteMiddlewareRegistry);
        mockery.registerMock('./registries/RouteHandlerRegistry', this.RouteHandlerRegistry);
        mockery.registerMock('./canisters/RouteCanister', this.RouteCanister);
        mockery.registerMock('./canisters/MiddlewareCanister', this.MiddlewareCanister);
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

        it('Should have a route resolver', function () {

            expect(this.folio.routeResolver).to.not.be.undefined;

        });

        it('Should have a route factory', function () {

            expect(this.folio.routeResolver).to.not.be.undefined;

        });

        it('Should have a route specification parser', function () {

            expect(this.folio.routeSpecificationParser).to.not.be.undefined;

        });

        it('Should have a route registry', function () {

            expect(this.folio.routeRegistry).to.not.be.undefined;

        });

        it('Should have a route middleware registry', function () {

            expect(this.folio.routeMiddlewareRegistry).to.not.be.undefined;

        });

        it('Should have a route handler registry', function () {

            expect(this.folio.routeHandlerRegistry).to.not.be.undefined;

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

            it('Should have the route factory build a route', function () {

                assert(this.folio.routeFactory.buildRoute.calledWith('GET', '/test/specification'));

            });

            it('A route canister should have been constructed correctly', function () {

                assert(this.RouteCanister.new.calledOnce);
                assert(this.RouteCanister.new.calledWith(
                    this.testRoute,
                    this.folio.routeRegistry,
                    this.folio.routeMiddlewareRegistry,
                    this.folio.routeHandlerRegistry
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

            it('Should have the route factory build a route', function () {

                assert(this.folio.routeFactory.buildRoute.calledWith('POST', '/test/specification'));

            });

            it('A route canister should have been constructed correctly', function () {

                assert(this.RouteCanister.new.calledOnce);
                assert(this.RouteCanister.new.calledWith(
                    this.testRoute,
                    this.folio.routeRegistry,
                    this.folio.routeMiddlewareRegistry,
                    this.folio.routeHandlerRegistry
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

            it('Should have the route factory build a route', function () {

                assert(this.folio.routeFactory.buildRoute.calledWith('PUT', '/test/specification'));

            });

            it('A route canister should have been constructed correctly', function () {

                assert(this.RouteCanister.new.calledOnce);
                assert(this.RouteCanister.new.calledWith(
                    this.testRoute,
                    this.folio.routeRegistry,
                    this.folio.routeMiddlewareRegistry,
                    this.folio.routeHandlerRegistry
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

            it('Should have the route factory build a route', function () {

                assert(this.folio.routeFactory.buildRoute.calledWith('DELETE', '/test/specification'));

            });

            it('A route canister should have been constructed correctly', function () {

                assert(this.RouteCanister.new.calledOnce);
                assert(this.RouteCanister.new.calledWith(
                    this.testRoute,
                    this.folio.routeRegistry,
                    this.folio.routeMiddlewareRegistry,
                    this.folio.routeHandlerRegistry
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

            it('Should have the route factory build a route', function () {

                assert(this.folio.routeFactory.buildRoute.calledWith('HEAD', '/test/specification'));

            });

            it('A route canister should have been constructed correctly', function () {

                assert(this.RouteCanister.new.calledOnce);
                assert(this.RouteCanister.new.calledWith(
                    this.testRoute,
                    this.folio.routeRegistry,
                    this.folio.routeMiddlewareRegistry,
                    this.folio.routeHandlerRegistry
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

            it('Should reset the route registry', function () {

                assert(this.folio.routeRegistry.reset.calledOnce);

            });

            it('Should reset the route middleware registry', function () {

                assert(this.folio.routeMiddlewareRegistry.reset.calledOnce);

            });

            it('Should reset the route handler registry', function () {

                assert(this.folio.routeHandlerRegistry.reset.calledOnce);

            });

        });

    });

});
