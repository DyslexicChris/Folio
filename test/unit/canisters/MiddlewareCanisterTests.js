var expect = require('chai').expect;
var assert = require('chai').assert;
var Stubs = require('./../Helpers/Stubs');
var Assertions = require('./../Helpers/Assertions');
var MiddlewareCanister = require('../../../lib/canisters/MiddlewareCanister');

describe('MiddlewareCanister', function () {

    beforeEach(function () {

        this.mockRouteMiddlewareRegistry = Stubs.newRouteMiddlewareRegistry();

        this.mockMiddlewareA = Stubs.newFunction();
        this.mockMiddlewareB = Stubs.newFunction();
        this.mockMiddlewareC = Stubs.newFunction();

    });

    describe('On new', function () {

        beforeEach(function () {

            this.middlewareCanister = new MiddlewareCanister(this.mockRouteMiddlewareRegistry);

        });

        it('Should have an empty array of middleware', function () {

            expect(this.middlewareCanister.middleware()).to.deep.equal([]);

        });

        describe('When adding a single middleware function', function () {

            beforeEach(function () {

                this.result = this.middlewareCanister.addMiddleware(this.mockMiddlewareA);

            });

            it('Should add it to its array of middleware', function () {

                expect(this.middlewareCanister.middleware()).to.deep.equal([this.mockMiddlewareA]);

            });

            it('Should return the middleware canister', function () {

                expect(this.result).to.deep.equal(this.middlewareCanister);

            });

        });

        describe('When adding multiple middleware functions', function () {

            beforeEach(function () {

                this.result = this.middlewareCanister.addMiddleware(this.mockMiddlewareA, this.mockMiddlewareB);

            });

            it('Should add it to its array of middleware', function () {

                expect(this.middlewareCanister.middleware()).to.deep.equal([this.mockMiddlewareA, this.mockMiddlewareB]);

            });

            it('Should return the middleware canister', function () {

                expect(this.result).to.deep.equal(this.middlewareCanister);

            });
        });

        describe('When adding a single null middleware', function () {

            it('Should throw an error - "Middleware is null"', function () {

                expect(this.middlewareCanister.addMiddleware).to.throw('Middleware is null');

            });

        });

        describe('When adding a single middleware that is not a function', function () {

            it('Should throw an error - "Middleware is not a function"', function () {

                Assertions.assertThrows(function () {
                    this.middlewareCanister.addMiddleware({hi: "there"});
                }, 'Middleware is not a function', this);

            });

        });

        describe('When adding a null middleware amongst multiple middleware', function () {

            it('Should throw an error "Middleware is null"', function () {

                Assertions.assertThrows(function () {
                    this.middlewareCanister.addMiddleware(this.mockMiddlewareA, null, this.mockMiddlewareB);
                }, 'Middleware is null', this);

            });

        });

        describe('When adding a single middleware that is not a function amongst multiple middleware', function () {

            it('Should throw an error - "Middleware is not a function"', function () {

                Assertions.assertThrows(function () {
                    this.middlewareCanister.addMiddleware(this.mockMiddlewareA, {hi: "there"}, this.mockMiddlewareB);
                }, 'Middleware is not a function', this);

            });

        });

        describe("When calling forRoute(...)", function () {

            beforeEach(function () {

                this.testRoute = {example: 'route'};

                this.middlewareCanister.addMiddleware(this.mockMiddlewareA, this.mockMiddlewareB);
                this.middlewareCanister.forRoute(this.testRoute);

            });

            it('Should add each middleware in the canister to the route middleware manager based on the given route', function () {

                assert(this.mockRouteMiddlewareRegistry.addMiddlewareForRoute.calledTwice);
                expect(this.mockRouteMiddlewareRegistry.addMiddlewareForRoute.getCall(0).args).to.deep.equal([this.testRoute, this.mockMiddlewareA]);
                expect(this.mockRouteMiddlewareRegistry.addMiddlewareForRoute.getCall(1).args).to.deep.equal([this.testRoute, this.mockMiddlewareB]);

            });

        });

        describe("When calling forAllRoutes()", function () {

            beforeEach(function () {

                this.middlewareCanister.addMiddleware(this.mockMiddlewareA, this.mockMiddlewareB);
                this.middlewareCanister.forAllRoutes();

            });

            it('Should add each middleware in the canister to the route middleware manager as global middleware', function () {

                assert(this.mockRouteMiddlewareRegistry.addGlobalMiddleware.calledTwice);
                expect(this.mockRouteMiddlewareRegistry.addGlobalMiddleware.getCall(0).args).to.deep.equal([this.mockMiddlewareA]);
                expect(this.mockRouteMiddlewareRegistry.addGlobalMiddleware.getCall(1).args).to.deep.equal([this.mockMiddlewareB]);

            });

        });

        describe("When calling forAllGets()", function () {

            beforeEach(function () {

                this.middlewareCanister.addMiddleware(this.mockMiddlewareA, this.mockMiddlewareB);
                this.middlewareCanister.forAllGets();

            });

            it('Should add each middleware in the canister to the route middleware manager as global middleware for all GETs', function () {

                assert(this.mockRouteMiddlewareRegistry.addMiddlewareForMethod.calledTwice);
                expect(this.mockRouteMiddlewareRegistry.addMiddlewareForMethod.getCall(0).args).to.deep.equal(['GET', this.mockMiddlewareA]);
                expect(this.mockRouteMiddlewareRegistry.addMiddlewareForMethod.getCall(1).args).to.deep.equal(['GET', this.mockMiddlewareB]);

            });

        });

        describe("When calling forAllPosts()", function () {

            beforeEach(function () {

                this.middlewareCanister.addMiddleware(this.mockMiddlewareA, this.mockMiddlewareB);
                this.middlewareCanister.forAllPosts();

            });

            it('Should add each middleware in the canister to the route middleware manager as global middleware for all POSTs', function () {

                assert(this.mockRouteMiddlewareRegistry.addMiddlewareForMethod.calledTwice);
                expect(this.mockRouteMiddlewareRegistry.addMiddlewareForMethod.getCall(0).args).to.deep.equal(['POST', this.mockMiddlewareA]);
                expect(this.mockRouteMiddlewareRegistry.addMiddlewareForMethod.getCall(1).args).to.deep.equal(['POST', this.mockMiddlewareB]);

            });

        });

        describe("When calling forAllPuts()", function () {

            beforeEach(function () {

                this.middlewareCanister.addMiddleware(this.mockMiddlewareA, this.mockMiddlewareB);
                this.middlewareCanister.forAllPuts();

            });

            it('Should add each middleware in the canister to the route middleware manager as global middleware for all PUTs', function () {

                assert(this.mockRouteMiddlewareRegistry.addMiddlewareForMethod.calledTwice);
                expect(this.mockRouteMiddlewareRegistry.addMiddlewareForMethod.getCall(0).args).to.deep.equal(['PUT', this.mockMiddlewareA]);
                expect(this.mockRouteMiddlewareRegistry.addMiddlewareForMethod.getCall(1).args).to.deep.equal(['PUT', this.mockMiddlewareB]);

            });

        });

        describe("When calling forAllDeletes()", function () {

            beforeEach(function () {

                this.middlewareCanister.addMiddleware(this.mockMiddlewareA, this.mockMiddlewareB);
                this.middlewareCanister.forAllDeletes();

            });

            it('Should add each middleware in the canister to the route middleware manager as global middleware for all DELETEs', function () {

                assert(this.mockRouteMiddlewareRegistry.addMiddlewareForMethod.calledTwice);
                expect(this.mockRouteMiddlewareRegistry.addMiddlewareForMethod.getCall(0).args).to.deep.equal(['DELETE', this.mockMiddlewareA]);
                expect(this.mockRouteMiddlewareRegistry.addMiddlewareForMethod.getCall(1).args).to.deep.equal(['DELETE', this.mockMiddlewareB]);

            });

        });

    });

});
