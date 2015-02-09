var expect = require('chai').expect;
var assert = require('chai').assert;
var Stubs = require('./Helpers/Stubs');
var RouteCanister = require('../../lib/RouteCanister');

describe('RouteCanister', function () {

    beforeEach(function () {

        this.mockMethod = 'put';
        this.mockSpecification = '/test/specification';

        this.mockRouteManager = Stubs.newRouteManager();
        this.mockRouteMiddlewareManager = Stubs.newRouteMiddlewareManager();
        this.mockRouteHandlerManager = Stubs.newRouteHandlerManager();

        this.mockMiddlewareA = Stubs.newFunction();
        this.mockMiddlewareB = Stubs.newFunction();
        this.mockMiddlewareC = Stubs.newFunction();
        this.mockHandler = Stubs.newFunction();

    });

    describe('On new using using the RouteCanister.new() method', function () {

        beforeEach(function () {

            this.routeCanister = RouteCanister.new(this.mockMethod, this.mockSpecification, this.mockRouteManager, this.mockRouteMiddlewareManager, this.mockRouteHandlerManager);

        });

        it('Should not be undefined', function(){

            expect(this.routeCanister).to.not.be.undefined;

        });

    });

    describe('On new using "new RouteCanister()"', function () {

        beforeEach(function () {

            this.routeCanister = new RouteCanister(this.mockMethod, this.mockSpecification, this.mockRouteManager, this.mockRouteMiddlewareManager, this.mockRouteHandlerManager);

        });

        it('Should not be undefined', function () {

            expect(this.routeCanister).to.not.be.undefined;

        });

        describe('Specifying a single middleware', function () {

            beforeEach(function () {

                this.result = this.routeCanister.middleware(this.mockMiddlewareA);

            });

            it('Should add the middleware for the route to the route middleware manager', function () {

                assert(this.mockRouteMiddlewareManager.addMiddlewareForRoute.calledOnce);
                assert(this.mockRouteMiddlewareManager.addMiddlewareForRoute.calledWith('put', '/test/specification'));

            });

            it('Should return the route canister', function () {

                expect(this.result).to.deep.equal(this.routeCanister);

            });

        });

        describe('Specifying multiple middleware', function () {

            beforeEach(function () {

                this.result = this.routeCanister.middleware(this.mockMiddlewareA, this.mockMiddlewareB);

            });

            it('Should add the middleware for the route to the route middleware manager', function () {

                assert(this.mockRouteMiddlewareManager.addMiddlewareForRoute.calledTwice);
                expect(this.mockRouteMiddlewareManager.addMiddlewareForRoute.getCall(0).args).to.deep.equal(['put', '/test/specification', this.mockMiddlewareA]);
                expect(this.mockRouteMiddlewareManager.addMiddlewareForRoute.getCall(1).args).to.deep.equal(['put', '/test/specification', this.mockMiddlewareB]);

            });

            it('Should return the route canister', function () {

                expect(this.result).to.deep.equal(this.routeCanister);

            });

            describe('Chaining another middleware addition', function () {

                beforeEach(function () {

                    this.mockRouteMiddlewareManager.addMiddlewareForRoute.reset();
                    this.result = this.routeCanister.middleware(this.mockMiddlewareC);

                });

                it('Should add the middleware for the route to the route middleware manager', function () {

                    assert(this.mockRouteMiddlewareManager.addMiddlewareForRoute.calledOnce);
                    assert(this.mockRouteMiddlewareManager.addMiddlewareForRoute.calledWith('put', '/test/specification'));

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

            it('Should add the route to the route manager', function () {

                assert(this.mockRouteManager.addRoute.calledOnce);
                assert(this.mockRouteManager.addRoute.calledWithExactly('put', '/test/specification'));

            });

            it('Should add the handler for the route to the route handler manager', function () {

                assert(this.mockRouteHandlerManager.addHandlerForRoute.calledOnce);
                assert(this.mockRouteHandlerManager.addHandlerForRoute.calledWith('put', '/test/specification'));

            });

            it('Should not return the route canister', function () {

                expect(this.result).to.be.undefined;

            });

        });

    });

});
