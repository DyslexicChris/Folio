var expect = require('chai').expect;
var assert = require('chai').assert;
var Stubs = require('./../Helpers/Stubs');
var Assertions = require('./../Helpers/Assertions');
var RouteMiddlewareRegistry = require('../../../lib/registries/RouteMiddlewareRegistry');
var Route = require('../../../lib/Route');

describe('RouteMiddlewareRegistry', function () {

    beforeEach(function () {

        this.routeMiddlewareRegistry = new RouteMiddlewareRegistry();

        this.mockRouteA = new Route();
        this.mockRouteA.setMethod('GET');
        this.mockRouteA.setSpecification('/mockRouteA');

        this.mockRouteB = new Route();
        this.mockRouteB.setMethod('GET');
        this.mockRouteB.setSpecification('/mockRouteB');

        this.validMiddlewareA = Stubs.newFunction();
        this.validMiddlewareB = Stubs.newFunction();
        this.validMiddlewareC = Stubs.newFunction();
        this.validMiddlewareD = Stubs.newFunction();

        this.invalidMiddleware = {};

    });

    describe('When adding middleware for a route', function () {

        describe('A valid middleware', function () {

            it('Should not throw an exception', function () {

                Assertions.assertNoThrow(function () {
                    this.routeMiddlewareRegistry.addMiddlewareForRoute(this.mockRouteA, this.validMiddlewareA);
                }, this);

            });

            it('Should return an array of middleware when asked', function () {

                this.routeMiddlewareRegistry.addMiddlewareForRoute(this.mockRouteA, this.validMiddlewareA);
                expect(this.routeMiddlewareRegistry.getMiddlewareForRoute(this.mockRouteA)).to.deep.equal([this.validMiddlewareA]);

            });

        });

        describe('Multiple middleware for a single route', function () {

            beforeEach(function () {

                this.routeMiddlewareRegistry.addMiddlewareForRoute(this.mockRouteA, this.validMiddlewareA);
                this.routeMiddlewareRegistry.addMiddlewareForRoute(this.mockRouteA, this.validMiddlewareB);
                this.routeMiddlewareRegistry.addMiddlewareForRoute(this.mockRouteA, this.validMiddlewareC);

            });

            it('Should return the correct middleware array when asked', function () {

                expect(this.routeMiddlewareRegistry.getMiddlewareForRoute(this.mockRouteA)).to.deep.equal([this.validMiddlewareA, this.validMiddlewareB, this.validMiddlewareC]);

            });

        });

        describe('Multiple middleware for a multiple routes', function () {

            beforeEach(function () {

                this.routeMiddlewareRegistry.addMiddlewareForRoute(this.mockRouteA, this.validMiddlewareA);
                this.routeMiddlewareRegistry.addMiddlewareForRoute(this.mockRouteA, this.validMiddlewareB);
                this.routeMiddlewareRegistry.addMiddlewareForRoute(this.mockRouteB, this.validMiddlewareC);
                this.routeMiddlewareRegistry.addMiddlewareForRoute(this.mockRouteB, this.validMiddlewareD);

            });

            it('Should return the correct middleware arrays when asked', function () {

                expect(this.routeMiddlewareRegistry.getMiddlewareForRoute(this.mockRouteA)).to.deep.equal([this.validMiddlewareA, this.validMiddlewareB]);
                expect(this.routeMiddlewareRegistry.getMiddlewareForRoute(this.mockRouteB)).to.deep.equal([this.validMiddlewareC, this.validMiddlewareD]);

            });

        });

        describe('An invalid middleware', function () {

            it('Should throw an exception', function () {

                Assertions.assertThrows(function () {
                    this.routeMiddlewareRegistry.addMiddlewareForRoute(this.mockRouteA, this.invalidMiddleware)
                }, 'Middleware is not a function', this);

            });

        });

    });

    describe('When adding middleware based on method', function () {

        describe('A valid middleware - all methods (global middleware)', function () {

            it('Should not throw an exception', function () {

                Assertions.assertNoThrow(function () {
                    this.routeMiddlewareRegistry.addGlobalMiddleware(this.validMiddlewareA)
                }, this);

            });

            it('Should return an array of middleware when asked', function () {

                this.routeMiddlewareRegistry.addGlobalMiddleware(this.validMiddlewareA);
                expect(this.routeMiddlewareRegistry.getGlobalMiddleware()).to.deep.equal([this.validMiddlewareA]);

            });

        });

        describe('A valid middleware - get', function () {

            it('Should not throw an exception', function () {

                Assertions.assertNoThrow(function () {
                    this.routeMiddlewareRegistry.addMiddlewareForMethod('get', this.validMiddlewareA)
                }, this);

            });

            it('Should return an array of middleware when asked (case insensitive)', function () {

                this.routeMiddlewareRegistry.addMiddlewareForMethod('get', this.validMiddlewareA);
                expect(this.routeMiddlewareRegistry.getMiddlewareForMethod('gEt')).to.deep.equal([this.validMiddlewareA]);

            });

        });

        describe('A valid middleware - post', function () {

            it('Should not throw an exception', function () {

                Assertions.assertNoThrow(function () {
                    this.routeMiddlewareRegistry.addMiddlewareForMethod('post', this.validMiddlewareB);
                }, this);

            });

            it('Should return an array of middleware when asked (case insensitive)', function () {

                this.routeMiddlewareRegistry.addMiddlewareForMethod('post', this.validMiddlewareB);
                expect(this.routeMiddlewareRegistry.getMiddlewareForMethod('pOst')).to.deep.equal([this.validMiddlewareB]);

            });

        });

        describe('A valid middleware - put', function () {

            it('Should not throw an exception', function () {

                Assertions.assertNoThrow(function () {
                    this.routeMiddlewareRegistry.addMiddlewareForMethod('put', this.validMiddlewareA)
                }, this);

            });

            it('Should return an array of middleware when asked (case insensitive)', function () {

                this.routeMiddlewareRegistry.addMiddlewareForMethod('put', this.validMiddlewareA);
                expect(this.routeMiddlewareRegistry.getMiddlewareForMethod('pUt')).to.deep.equal([this.validMiddlewareA]);

            });

        });

        describe('A valid middleware - delete', function () {

            it('Should not throw an exception', function () {

                Assertions.assertNoThrow(function () {
                    this.routeMiddlewareRegistry.addMiddlewareForMethod('delete', this.validMiddlewareA)
                }, this);

            });

            it('Should return an array of middleware when asked (case insensitive)', function () {

                this.routeMiddlewareRegistry.addMiddlewareForMethod('delete', this.validMiddlewareA);
                expect(this.routeMiddlewareRegistry.getMiddlewareForMethod('dElete')).to.deep.equal([this.validMiddlewareA]);

            });

        });

        describe('A valid middleware - other', function () {

            it('Should not throw an exception', function () {

                Assertions.assertNoThrow(function () {
                    this.routeMiddlewareRegistry.addMiddlewareForMethod('other', this.validMiddlewareB)
                }, this);

            });

            it('Should return an array of middleware when asked (case insensitive)', function () {

                this.routeMiddlewareRegistry.addMiddlewareForMethod('other', this.validMiddlewareB);
                expect(this.routeMiddlewareRegistry.getMiddlewareForMethod('oTher')).to.deep.equal([this.validMiddlewareB]);

            });

        });

        describe('Multiple middleware', function () {

            beforeEach(function () {

                this.routeMiddlewareRegistry.addGlobalMiddleware(this.validMiddlewareA);
                this.routeMiddlewareRegistry.addGlobalMiddleware(this.validMiddlewareB);
                this.routeMiddlewareRegistry.addGlobalMiddleware(this.validMiddlewareC);
                this.routeMiddlewareRegistry.addGlobalMiddleware(this.validMiddlewareD);

            });

            it('Should return the correct middleware array when asked', function () {

                expect(this.routeMiddlewareRegistry.getGlobalMiddleware()).to.deep.equal([this.validMiddlewareA, this.validMiddlewareB, this.validMiddlewareC, this.validMiddlewareD]);

            });

        });

        describe('An invalid middleware - for global, GET, POST, PUT, DELETE, OTHER', function () {

            it('Should throw an exception for "all"', function () {

                Assertions.assertThrows(function () {
                    this.routeMiddlewareRegistry.addGlobalMiddleware(this.invalidMiddleware)
                }, 'Middleware is not a function', this);

            });

            it('Should throw an exception for "get"', function () {

                Assertions.assertThrows(function () {
                    this.routeMiddlewareRegistry.addMiddlewareForMethod('get', this.invalidMiddleware)
                }, 'Middleware is not a function', this);

            });

            it('Should throw an exception for "post"', function () {

                Assertions.assertThrows(function () {
                    this.routeMiddlewareRegistry.addMiddlewareForMethod('post', this.invalidMiddleware)
                }, 'Middleware is not a function', this);

            });

            it('Should throw an exception for "put"', function () {

                Assertions.assertThrows(function () {
                    this.routeMiddlewareRegistry.addMiddlewareForMethod('put', this.invalidMiddleware)
                }, 'Middleware is not a function', this);

            });

            it('Should throw an exception for "delete"', function () {

                Assertions.assertThrows(function () {
                    this.routeMiddlewareRegistry.addMiddlewareForMethod('delete', this.invalidMiddleware)
                }, 'Middleware is not a function', this);

            });

            it('Should throw an exception for "other"', function () {

                Assertions.assertThrows(function () {
                    this.routeMiddlewareRegistry.addMiddlewareForMethod('other', this.invalidMiddleware)
                }, 'Middleware is not a function', this);

            });

        });

    });

    describe('On reset()', function () {

        beforeEach(function () {

            this.routeMiddlewareRegistry.addMiddlewareForMethod('GET', this.validMiddlewareA);
            this.routeMiddlewareRegistry.addMiddlewareForRoute(this.mockRouteA, this.validMiddlewareB);

            expect(this.routeMiddlewareRegistry.getMiddlewareForMethod('GET')).to.deep.equal([this.validMiddlewareA]);
            expect(this.routeMiddlewareRegistry.getMiddlewareForRoute(this.mockRouteA)).to.deep.equal([this.validMiddlewareB]);

            this.routeMiddlewareRegistry.reset();

        });

        it('Should remove all middleware', function () {

            expect(this.routeMiddlewareRegistry.getMiddlewareForMethod('GET')).to.deep.equal([]);
            expect(this.routeMiddlewareRegistry.getMiddlewareForRoute(this.mockRouteA)).to.deep.equal([]);

        });

    });

});
