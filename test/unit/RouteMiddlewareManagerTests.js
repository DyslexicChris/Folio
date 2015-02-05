var expect = require('chai').expect;
var assert = require('chai').assert;
var Stubs = require('./Helpers/Stubs');
var Assertions = require('./Helpers/Assertions');
var RouteMiddlewareManager = require('../../lib/RouteMiddlewareManager');

describe('RouteMiddlewareManager', function () {

    beforeEach(function () {

        this.routeMiddlewareManager = new RouteMiddlewareManager();

        this.mockRouteA = {
            method: 'get',
            specification: '/testA'
        };

        this.mockRouteB = {
            method: 'post',
            specification: '/testB'
        };

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
                    this.routeMiddlewareManager.addMiddlewareForRoute(this.mockRouteA.method, this.mockRouteA.specification, this.validMiddlewareA);
                }, this);

            });

            it('Should return an array of middleware when asked', function () {

                this.routeMiddlewareManager.addMiddlewareForRoute(this.mockRouteA.method, this.mockRouteA.specification, this.validMiddlewareA);
                expect(this.routeMiddlewareManager.getMiddlewareForRoute(this.mockRouteA.method, this.mockRouteA.specification)).to.deep.equal([this.validMiddlewareA]);

            });

            it('Should return an array of middleware when asked - even when the method casing is different than defined', function () {

                this.routeMiddlewareManager.addMiddlewareForRoute(this.mockRouteA.method, this.mockRouteA.specification, this.validMiddlewareA);
                expect(this.routeMiddlewareManager.getMiddlewareForRoute('gEt', this.mockRouteA.specification)).to.deep.equal([this.validMiddlewareA]);

            });

            it('Should return an empty array of middleware when asked, if the path casing does not match that of the specification', function () {

                this.routeMiddlewareManager.addMiddlewareForRoute(this.mockRouteA.method, this.mockRouteA.specification, this.validMiddlewareA);
                expect(this.routeMiddlewareManager.getMiddlewareForRoute(this.mockRouteA.method, '/testa')).to.deep.equal([]);

            });

        });

        describe('Multiple middleware for a single route', function () {

            beforeEach(function () {

                this.routeMiddlewareManager.addMiddlewareForRoute(this.mockRouteA.method, this.mockRouteA.specification, this.validMiddlewareA);
                this.routeMiddlewareManager.addMiddlewareForRoute(this.mockRouteA.method, this.mockRouteA.specification, this.validMiddlewareB);
                this.routeMiddlewareManager.addMiddlewareForRoute(this.mockRouteA.method, this.mockRouteA.specification, this.validMiddlewareC);

            });

            it('Should return the correct middleware array when asked (case insensitive method)', function () {

                expect(this.routeMiddlewareManager.getMiddlewareForRoute('gEt', this.mockRouteA.specification)).to.deep.equal([this.validMiddlewareA, this.validMiddlewareB, this.validMiddlewareC]);

            });

        });

        describe('Multiple middleware for a multiple routes', function () {

            beforeEach(function () {

                this.routeMiddlewareManager.addMiddlewareForRoute(this.mockRouteA.method, this.mockRouteA.specification, this.validMiddlewareA);
                this.routeMiddlewareManager.addMiddlewareForRoute(this.mockRouteA.method, this.mockRouteA.specification, this.validMiddlewareB);
                this.routeMiddlewareManager.addMiddlewareForRoute(this.mockRouteB.method, this.mockRouteB.specification, this.validMiddlewareC);
                this.routeMiddlewareManager.addMiddlewareForRoute(this.mockRouteB.method, this.mockRouteB.specification, this.validMiddlewareD);

            });

            it('Should return the correct middleware arrays when asked (case insensitive method)', function () {

                expect(this.routeMiddlewareManager.getMiddlewareForRoute('gEt', this.mockRouteA.specification)).to.deep.equal([this.validMiddlewareA, this.validMiddlewareB]);
                expect(this.routeMiddlewareManager.getMiddlewareForRoute('pOSt', this.mockRouteB.specification)).to.deep.equal([this.validMiddlewareC, this.validMiddlewareD]);

            });

        });

        describe('An invalid middleware', function () {

            it('Should throw an exception', function () {

                Assertions.assertThrows(function () {
                    this.routeMiddlewareManager.addMiddlewareForRoute(this.mockRouteA.method, this.mockRouteA.specification, this.invalidMiddleware)
                }, 'Middleware is not a function', this);

            });

        });

    });

    describe('When adding middleware based on method', function () {

        describe('A valid middleware - all methods (global middleware)', function () {

            it('Should not throw an exception', function () {

                Assertions.assertNoThrow(function () {
                    this.routeMiddlewareManager.addGlobalMiddleware(this.validMiddlewareA)
                }, this);

            });

            it('Should return an array of middleware when asked', function () {

                this.routeMiddlewareManager.addGlobalMiddleware(this.validMiddlewareA);
                expect(this.routeMiddlewareManager.getGlobalMiddleware()).to.deep.equal([this.validMiddlewareA]);

            });

        });

        describe('A valid middleware - get', function () {

            it('Should not throw an exception', function () {

                Assertions.assertNoThrow(function () {
                    this.routeMiddlewareManager.addMiddlewareForMethod('get', this.validMiddlewareA)
                }, this);

            });

            it('Should return an array of middleware when asked (case insensitive)', function () {

                this.routeMiddlewareManager.addMiddlewareForMethod('get', this.validMiddlewareA);
                expect(this.routeMiddlewareManager.getMiddlewareForMethod('gEt')).to.deep.equal([this.validMiddlewareA]);

            });

        });

        describe('A valid middleware - post', function () {

            it('Should not throw an exception', function () {

                Assertions.assertNoThrow(function () {
                    this.routeMiddlewareManager.addMiddlewareForMethod('post', this.validMiddlewareB);
                }, this);

            });

            it('Should return an array of middleware when asked (case insensitive)', function () {

                this.routeMiddlewareManager.addMiddlewareForMethod('post', this.validMiddlewareB);
                expect(this.routeMiddlewareManager.getMiddlewareForMethod('pOst')).to.deep.equal([this.validMiddlewareB]);

            });

        });

        describe('A valid middleware - put', function () {

            it('Should not throw an exception', function () {

                Assertions.assertNoThrow(function () {
                    this.routeMiddlewareManager.addMiddlewareForMethod('put', this.validMiddlewareA)
                }, this);

            });

            it('Should return an array of middleware when asked (case insensitive)', function () {

                this.routeMiddlewareManager.addMiddlewareForMethod('put', this.validMiddlewareA);
                expect(this.routeMiddlewareManager.getMiddlewareForMethod('pUt')).to.deep.equal([this.validMiddlewareA]);

            });

        });

        describe('A valid middleware - delete', function () {

            it('Should not throw an exception', function () {

                Assertions.assertNoThrow(function () {
                    this.routeMiddlewareManager.addMiddlewareForMethod('delete', this.validMiddlewareA)
                }, this);

            });

            it('Should return an array of middleware when asked (case insensitive)', function () {

                this.routeMiddlewareManager.addMiddlewareForMethod('delete', this.validMiddlewareA);
                expect(this.routeMiddlewareManager.getMiddlewareForMethod('dElete')).to.deep.equal([this.validMiddlewareA]);

            });

        });

        describe('A valid middleware - other', function () {

            it('Should not throw an exception', function () {

                Assertions.assertNoThrow(function () {
                    this.routeMiddlewareManager.addMiddlewareForMethod('other', this.validMiddlewareB)
                }, this);

            });

            it('Should return an array of middleware when asked (case insensitive)', function () {

                this.routeMiddlewareManager.addMiddlewareForMethod('other', this.validMiddlewareB);
                expect(this.routeMiddlewareManager.getMiddlewareForMethod('oTher')).to.deep.equal([this.validMiddlewareB]);

            });

        });

        describe('Multiple middleware', function () {

            beforeEach(function () {

                this.routeMiddlewareManager.addGlobalMiddleware(this.validMiddlewareA);
                this.routeMiddlewareManager.addGlobalMiddleware(this.validMiddlewareB);
                this.routeMiddlewareManager.addGlobalMiddleware(this.validMiddlewareC);
                this.routeMiddlewareManager.addGlobalMiddleware(this.validMiddlewareD);

            });

            it('Should return the correct middleware array when asked', function () {

                expect(this.routeMiddlewareManager.getGlobalMiddleware()).to.deep.equal([this.validMiddlewareA, this.validMiddlewareB, this.validMiddlewareC, this.validMiddlewareD]);

            });

        });

        describe('An invalid middleware - for global, GET, POST, PUT, DELETE, OTHER', function () {

            it('Should throw an exception for "all"', function () {

                Assertions.assertThrows(function () {
                    this.routeMiddlewareManager.addGlobalMiddleware(this.invalidMiddleware)
                }, 'Middleware is not a function', this);

            });

            it('Should throw an exception for "get"', function () {

                Assertions.assertThrows(function () {
                    this.routeMiddlewareManager.addMiddlewareForMethod('get', this.invalidMiddleware)
                }, 'Middleware is not a function', this);

            });

            it('Should throw an exception for "post"', function () {

                Assertions.assertThrows(function () {
                    this.routeMiddlewareManager.addMiddlewareForMethod('post', this.invalidMiddleware)
                }, 'Middleware is not a function', this);

            });

            it('Should throw an exception for "put"', function () {

                Assertions.assertThrows(function () {
                    this.routeMiddlewareManager.addMiddlewareForMethod('put', this.invalidMiddleware)
                }, 'Middleware is not a function', this);

            });

            it('Should throw an exception for "delete"', function () {

                Assertions.assertThrows(function () {
                    this.routeMiddlewareManager.addMiddlewareForMethod('delete', this.invalidMiddleware)
                }, 'Middleware is not a function', this);

            });

            it('Should throw an exception for "other"', function () {

                Assertions.assertThrows(function () {
                    this.routeMiddlewareManager.addMiddlewareForMethod('other', this.invalidMiddleware)
                }, 'Middleware is not a function', this);

            });

        });

    });

    describe('On reset()', function () {

        beforeEach(function () {

            this.routeMiddlewareManager.addMiddlewareForMethod('GET', this.validMiddlewareA);
            this.routeMiddlewareManager.addMiddlewareForRoute('POST', '/test-specification', this.validMiddlewareB);

            expect(this.routeMiddlewareManager.getMiddlewareForMethod('GET')).to.deep.equal([this.validMiddlewareA]);
            expect(this.routeMiddlewareManager.getMiddlewareForRoute('POST', '/test-specification')).to.deep.equal([this.validMiddlewareB]);

            this.routeMiddlewareManager.reset();

        });

        it('Should remove all middleware', function () {

            expect(this.routeMiddlewareManager.getMiddlewareForMethod('GET')).to.deep.equal([]);
            expect(this.routeMiddlewareManager.getMiddlewareForRoute('POST', '/test-specification')).to.deep.equal([]);

        });

    });

});
