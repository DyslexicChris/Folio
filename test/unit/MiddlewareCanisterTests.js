var _ = require('underscore');
var expect = require('chai').expect;
var sinon = require('sinon');
var MiddlewareCanister = require('../../lib/MiddlewareCanister');

describe('MiddlewareCanister', function () {

    beforeEach(function () {

        this.mockMethod = 'put';
        this.mockSpecification = '/test/specification';

        this.mockRouteMiddlewareManager = {
            addMiddlewareForRoute: function () {
            },
            addGlobalMiddleware: function () {
            },
            addMiddlewareForMethod: function () {
            }
        };

        this.mockMiddlewareA = function () {
        };

        this.mockMiddlewareB = function () {
        };

        this.mockMiddlewareC = function () {
        };

        this.spies = {};
        this.spies.routeMiddlewareManagerAddMiddlewareForRoute = sinon.spy(this.mockRouteMiddlewareManager, 'addMiddlewareForRoute');
        this.spies.routeMiddlewareManagerAddGlobalMiddleware = sinon.spy(this.mockRouteMiddlewareManager, 'addGlobalMiddleware');
        this.spies.routeMiddlewareManagerAddMiddlewareForMethod = sinon.spy(this.mockRouteMiddlewareManager, 'addMiddlewareForMethod');

    });

    afterEach(function () {
        _.each(this.spies, function (spy) {
            spy.restore();
        })
    });

    describe('On new', function () {

        beforeEach(function () {

            this.middlewareCanister = new MiddlewareCanister(this.mockRouteMiddlewareManager);

        });

        it('Should have an empty array of middleware', function () {

            expect(this.middlewareCanister.middleware()).to.deep.equal([]);

        });

        it('Should have its route middleware manager set', function () {

            expect(this.middlewareCanister._routeMiddlewareManager).to.deep.equal(this.mockRouteMiddlewareManager);

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

                var thisTest = this;
                expect(function () {
                    thisTest.middlewareCanister.addMiddleware({hi: "there"});
                }).to.throw('Middleware is not a function');

            });

        });

        describe('When adding a null middleware amongst multiple middleware', function () {

            it('Should throw an error "Middleware is null"', function () {

                var thisTest = this;
                expect(function () {
                    thisTest.middlewareCanister.addMiddleware(thisTest.mockMiddlewareA, null, thisTest.mockMiddlewareB);
                }).to.throw('Middleware is null');
            });

        });

        describe('When adding a single middleware that is not a function amongst multiple middleware', function () {

            it('Should throw an error - "Middleware is not a function"', function () {

                var thisTest = this;
                expect(function () {
                    thisTest.middlewareCanister.addMiddleware(thisTest.mockMiddlewareA, {hi: "there"}, thisTest.mockMiddlewareB);
                }).to.throw('Middleware is not a function');

            });

        });

        describe("When calling forRoute(...)", function () {

            beforeEach(function () {

                var routeSpecification = '/test/route';
                var method = 'get';

                this.middlewareCanister.addMiddleware(this.mockMiddlewareA, this.mockMiddlewareB);
                this.middlewareCanister.forRoute(method, routeSpecification);

            });

            it('Should add each middleware in the canister to the route middleware manager based on the given method and specification', function () {

                expect(this.mockRouteMiddlewareManager.addMiddlewareForRoute.callCount).to.equal(2);
                expect(this.mockRouteMiddlewareManager.addMiddlewareForRoute.getCall(0).args).to.deep.equal(['get', '/test/route', this.mockMiddlewareA]);
                expect(this.mockRouteMiddlewareManager.addMiddlewareForRoute.getCall(1).args).to.deep.equal(['get', '/test/route', this.mockMiddlewareB]);

            });

        });

        describe("When calling forAllRoutes()", function () {

            beforeEach(function () {

                this.middlewareCanister.addMiddleware(this.mockMiddlewareA, this.mockMiddlewareB);
                this.middlewareCanister.forAllRoutes();

            });

            it('Should add each middleware in the canister to the route middleware manager as global middleware', function () {

                expect(this.mockRouteMiddlewareManager.addGlobalMiddleware.callCount).to.equal(2);
                expect(this.mockRouteMiddlewareManager.addGlobalMiddleware.getCall(0).args).to.deep.equal([this.mockMiddlewareA]);
                expect(this.mockRouteMiddlewareManager.addGlobalMiddleware.getCall(1).args).to.deep.equal([this.mockMiddlewareB]);

            });

        });

        describe("When calling forAllGets()", function () {

            beforeEach(function () {

                this.middlewareCanister.addMiddleware(this.mockMiddlewareA, this.mockMiddlewareB);
                this.middlewareCanister.forAllGets();

            });

            it('Should add each middleware in the canister to the route middleware manager as global middleware for all GETs', function () {

                expect(this.mockRouteMiddlewareManager.addMiddlewareForMethod.callCount).to.equal(2);
                expect(this.mockRouteMiddlewareManager.addMiddlewareForMethod.getCall(0).args).to.deep.equal(['GET', this.mockMiddlewareA]);
                expect(this.mockRouteMiddlewareManager.addMiddlewareForMethod.getCall(1).args).to.deep.equal(['GET', this.mockMiddlewareB]);

            });

        });

        describe("When calling forAllPosts()", function () {

            beforeEach(function () {

                this.middlewareCanister.addMiddleware(this.mockMiddlewareA, this.mockMiddlewareB);
                this.middlewareCanister.forAllPosts();

            });

            it('Should add each middleware in the canister to the route middleware manager as global middleware for all POSTs', function () {

                expect(this.mockRouteMiddlewareManager.addMiddlewareForMethod.callCount).to.equal(2);
                expect(this.mockRouteMiddlewareManager.addMiddlewareForMethod.getCall(0).args).to.deep.equal(['POST', this.mockMiddlewareA]);
                expect(this.mockRouteMiddlewareManager.addMiddlewareForMethod.getCall(1).args).to.deep.equal(['POST', this.mockMiddlewareB]);

            });

        });

        describe("When calling forAllPuts()", function () {

            beforeEach(function () {

                this.middlewareCanister.addMiddleware(this.mockMiddlewareA, this.mockMiddlewareB);
                this.middlewareCanister.forAllPuts();

            });

            it('Should add each middleware in the canister to the route middleware manager as global middleware for all PUTs', function () {

                expect(this.mockRouteMiddlewareManager.addMiddlewareForMethod.callCount).to.equal(2);
                expect(this.mockRouteMiddlewareManager.addMiddlewareForMethod.getCall(0).args).to.deep.equal(['PUT', this.mockMiddlewareA]);
                expect(this.mockRouteMiddlewareManager.addMiddlewareForMethod.getCall(1).args).to.deep.equal(['PUT', this.mockMiddlewareB]);

            });

        });

        describe("When calling forAllDeletes()", function () {

            beforeEach(function () {

                this.middlewareCanister.addMiddleware(this.mockMiddlewareA, this.mockMiddlewareB);
                this.middlewareCanister.forAllDeletes();

            });

            it('Should add each middleware in the canister to the route middleware manager as global middleware for all DELETEs', function () {

                expect(this.mockRouteMiddlewareManager.addMiddlewareForMethod.callCount).to.equal(2);
                expect(this.mockRouteMiddlewareManager.addMiddlewareForMethod.getCall(0).args).to.deep.equal(['DELETE', this.mockMiddlewareA]);
                expect(this.mockRouteMiddlewareManager.addMiddlewareForMethod.getCall(1).args).to.deep.equal(['DELETE', this.mockMiddlewareB]);

            });

        });


    });

});
