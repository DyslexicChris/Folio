var expect = require('chai').expect;
var assert = require('chai').assert;
var Stubs = require('./../Helpers/Stubs');
var RouteCanister = require('../../../lib/canisters/RouteCanister');
var Route = require('../../../lib/Route');

describe('RouteCanister', function () {

    beforeEach(function () {

        this.mockRoute = new Route();

        this.mockRouteRegistry = Stubs.newRouteRegistry();
        this.mockRouteMiddlewareRegistry = Stubs.newRouteMiddlewareRegistry();
        this.mockRouteHandlerRegistry = Stubs.newRouteHandlerRegistry();

        this.mockMiddlewareA = Stubs.newFunction();
        this.mockMiddlewareB = Stubs.newFunction();
        this.mockMiddlewareC = Stubs.newFunction();
        this.mockHandler = Stubs.newFunction();

    });

    describe('On new using using the RouteCanister.new() method', function () {

        beforeEach(function () {

            this.routeCanister = RouteCanister.new(this.mockRoute, this.mockRouteRegistry, this.mockRouteMiddlewareRegistry, this.mockRouteHandlerRegistry);

        });

        it('Should not be undefined', function () {

            expect(this.routeCanister).to.not.be.undefined;

        });

    });

    describe('On new using "new RouteCanister()"', function () {

        beforeEach(function () {

            this.routeCanister = new RouteCanister(this.mockRoute, this.mockRouteRegistry, this.mockRouteMiddlewareRegistry, this.mockRouteHandlerRegistry);

        });

        it('Should not be undefined', function () {

            expect(this.routeCanister).to.not.be.undefined;

        });

        describe('Specifying a single middleware', function () {

            beforeEach(function () {

                this.result = this.routeCanister.middleware(this.mockMiddlewareA);

            });

            it('Should add the middleware for the route to the route middleware registry', function () {

                assert(this.mockRouteMiddlewareRegistry.addMiddlewareForRoute.calledOnce);
                assert(this.mockRouteMiddlewareRegistry.addMiddlewareForRoute.calledWith(this.mockRoute, this.mockMiddlewareA));

            });

            it('Should return the route canister', function () {

                expect(this.result).to.deep.equal(this.routeCanister);

            });

        });

        describe('Specifying multiple middleware', function () {

            beforeEach(function () {

                this.result = this.routeCanister.middleware(this.mockMiddlewareA, this.mockMiddlewareB);

            });

            it('Should add the middleware for the route to the route middleware registry', function () {

                assert(this.mockRouteMiddlewareRegistry.addMiddlewareForRoute.calledTwice);
                expect(this.mockRouteMiddlewareRegistry.addMiddlewareForRoute.getCall(0).args).to.deep.equal([this.mockRoute, this.mockMiddlewareA]);
                expect(this.mockRouteMiddlewareRegistry.addMiddlewareForRoute.getCall(1).args).to.deep.equal([this.mockRoute, this.mockMiddlewareB]);

            });

            it('Should return the route canister', function () {

                expect(this.result).to.deep.equal(this.routeCanister);

            });

            describe('Chaining another middleware addition', function () {

                beforeEach(function () {

                    this.mockRouteMiddlewareRegistry.addMiddlewareForRoute.reset();
                    this.result = this.routeCanister.middleware(this.mockMiddlewareC);

                });

                it('Should add the middleware for the route to the route middleware registry', function () {

                    assert(this.mockRouteMiddlewareRegistry.addMiddlewareForRoute.calledOnce);
                    assert(this.mockRouteMiddlewareRegistry.addMiddlewareForRoute.calledWith(this.mockRoute, this.mockMiddlewareC));

                });

                it('Should return the route canister', function () {

                    expect(this.result).to.deep.equal(this.routeCanister);

                });

            });

        });

        describe('Specifying a handler', function () {

            beforeEach(function () {

                this.result = this.routeCanister.handler(this.mockHandler);

            });

            it('Should add the route to the route registry', function () {

                assert(this.mockRouteRegistry.addRoute.calledOnce);
                assert(this.mockRouteRegistry.addRoute.calledWithExactly(this.mockRoute));

            });

            it('Should add the handler for the route to the route handler registry', function () {

                assert(this.mockRouteHandlerRegistry.addHandlerForRoute.calledOnce);
                assert(this.mockRouteHandlerRegistry.addHandlerForRoute.calledWith(this.mockRoute, this.mockHandler));

            });

            it('Should not return the route canister', function () {

                expect(this.result).to.be.undefined;

            });

        });

    });

});
