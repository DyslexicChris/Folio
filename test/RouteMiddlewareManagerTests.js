var expect = require('chai').expect;
var RouteMiddlewareManager = require('../lib/RouteMiddlewareManager');

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

        this.validMiddlewareA = function () {
        };

        this.validMiddlewareB = function () {
        };

        this.validMiddlewareC = function () {
        };

        this.validMiddlewareD = function () {
        };

        this.invalidMiddleware = {};

    });

    describe('When adding middleware for a route', function () {

        describe('A valid middleware', function () {

            it('Should not throw an exception', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.routeMiddlewareManager.addMiddlewareForRoute(thisTest.mockRouteA.method, thisTest.mockRouteA.specification, thisTest.validMiddlewareA)
                }).to.not.throw();

            });

            it('Should return an array of middleware when asked', function () {

                this.routeMiddlewareManager.addMiddlewareForRoute(this.mockRouteA.method, this.mockRouteA.specification, this.validMiddlewareA);
                expect(this.routeMiddlewareManager.getMiddlewareForRoute(this.mockRouteA.method, this.mockRouteA.specification)).to.deep.equal([this.validMiddlewareA]);

            });

        });

        describe('Multiple middleware for a single route', function () {

            beforeEach(function () {

                this.routeMiddlewareManager.addMiddlewareForRoute(this.mockRouteA.method, this.mockRouteA.specification, this.validMiddlewareA);
                this.routeMiddlewareManager.addMiddlewareForRoute(this.mockRouteA.method, this.mockRouteA.specification, this.validMiddlewareB);
                this.routeMiddlewareManager.addMiddlewareForRoute(this.mockRouteA.method, this.mockRouteA.specification, this.validMiddlewareC);

            });

            it('Should return the correct middleware array when asked', function () {

                expect(this.routeMiddlewareManager.getMiddlewareForRoute(this.mockRouteA.method, this.mockRouteA.specification)).to.deep.equal([this.validMiddlewareA, this.validMiddlewareB, this.validMiddlewareC]);

            });

        });

        describe('Multiple middleware for a multiple routes', function () {

            beforeEach(function () {

                this.routeMiddlewareManager.addMiddlewareForRoute(this.mockRouteA.method, this.mockRouteA.specification, this.validMiddlewareA);
                this.routeMiddlewareManager.addMiddlewareForRoute(this.mockRouteA.method, this.mockRouteA.specification, this.validMiddlewareB);
                this.routeMiddlewareManager.addMiddlewareForRoute(this.mockRouteB.method, this.mockRouteB.specification, this.validMiddlewareC);
                this.routeMiddlewareManager.addMiddlewareForRoute(this.mockRouteB.method, this.mockRouteB.specification, this.validMiddlewareD);

            });

            it('Should return the correct middleware arrays when asked', function () {

                expect(this.routeMiddlewareManager.getMiddlewareForRoute(this.mockRouteA.method, this.mockRouteA.specification)).to.deep.equal([this.validMiddlewareA, this.validMiddlewareB]);
                expect(this.routeMiddlewareManager.getMiddlewareForRoute(this.mockRouteB.method, this.mockRouteB.specification)).to.deep.equal([this.validMiddlewareC, this.validMiddlewareD]);

            });

        });

        describe('An invalid middleware', function () {

            it('Should throw an exception', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.routeMiddlewareManager.addMiddlewareForRoute(thisTest.mockRouteA.method, thisTest.mockRouteA.specification, thisTest.invalidMiddleware)
                }).to.throw('Middleware is not a function');

            });

        });

    });

    describe('When adding middleware based on method', function () {

        describe('A valid middleware - all methods', function () {

            it('Should not throw an exception', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.routeMiddlewareManager.addGlobalMiddleware(thisTest.validMiddlewareA)
                }).to.not.throw();

            });

            it('Should return an array of middleware when asked', function () {

                this.routeMiddlewareManager.addGlobalMiddleware(this.validMiddlewareA);
                expect(this.routeMiddlewareManager.getGlobalMiddleware()).to.deep.equal([this.validMiddlewareA]);

            });

        });

        describe('A valid middleware - get', function () {

            it('Should not throw an exception', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.routeMiddlewareManager.addMiddlewareForMethod('get', thisTest.validMiddlewareA)
                }).to.not.throw();

            });

            it('Should return an array of middleware when asked', function () {

                this.routeMiddlewareManager.addMiddlewareForMethod('get', this.validMiddlewareA);
                expect(this.routeMiddlewareManager.getMiddlewareForMethod('get')).to.deep.equal([this.validMiddlewareA]);

            });

        });

        describe('A valid middleware - post', function () {

            it('Should not throw an exception', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.routeMiddlewareManager.addMiddlewareForMethod('post', thisTest.validMiddlewareB)
                }).to.not.throw();

            });

            it('Should return an array of middleware when asked', function () {

                this.routeMiddlewareManager.addMiddlewareForMethod('post', this.validMiddlewareB);
                expect(this.routeMiddlewareManager.getMiddlewareForMethod('post')).to.deep.equal([this.validMiddlewareB]);

            });

        });

        describe('A valid middleware - put', function () {

            it('Should not throw an exception', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.routeMiddlewareManager.addMiddlewareForMethod('put', thisTest.validMiddlewareA)
                }).to.not.throw();

            });

            it('Should return an array of middleware when asked', function () {

                this.routeMiddlewareManager.addMiddlewareForMethod('put', this.validMiddlewareA);
                expect(this.routeMiddlewareManager.getMiddlewareForMethod('put')).to.deep.equal([this.validMiddlewareA]);

            });

        });

        describe('A valid middleware - delete', function () {

            it('Should not throw an exception', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.routeMiddlewareManager.addMiddlewareForMethod('delete', thisTest.validMiddlewareA)
                }).to.not.throw();

            });

            it('Should return an array of middleware when asked', function () {

                this.routeMiddlewareManager.addMiddlewareForMethod('delete', this.validMiddlewareA);
                expect(this.routeMiddlewareManager.getMiddlewareForMethod('delete')).to.deep.equal([this.validMiddlewareA]);

            });

        });

        describe('A valid middleware - other', function () {

            it('Should not throw an exception', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.routeMiddlewareManager.addMiddlewareForMethod('other', thisTest.validMiddlewareB)
                }).to.not.throw();

            });

            it('Should return an array of middleware when asked', function () {

                this.routeMiddlewareManager.addMiddlewareForMethod('other', this.validMiddlewareB);
                expect(this.routeMiddlewareManager.getMiddlewareForMethod('other')).to.deep.equal([this.validMiddlewareB]);

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

                var thisTest = this;

                expect(function () {
                    thisTest.routeMiddlewareManager.addGlobalMiddleware(thisTest.invalidMiddleware)
                }).to.throw('Middleware is not a function');

            });

            it('Should throw an exception for "get"', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.routeMiddlewareManager.addMiddlewareForMethod('get', thisTest.invalidMiddleware)
                }).to.throw('Middleware is not a function');

            });

            it('Should throw an exception for "post"', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.routeMiddlewareManager.addMiddlewareForMethod('post', thisTest.invalidMiddleware)
                }).to.throw('Middleware is not a function');

            });

            it('Should throw an exception for "put"', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.routeMiddlewareManager.addMiddlewareForMethod('put', thisTest.invalidMiddleware)
                }).to.throw('Middleware is not a function');

            });

            it('Should throw an exception for "delete"', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.routeMiddlewareManager.addMiddlewareForMethod('delete', thisTest.invalidMiddleware)
                }).to.throw('Middleware is not a function');

            });

            it('Should throw an exception for "other"', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.routeMiddlewareManager.addMiddlewareForMethod('other', thisTest.invalidMiddleware)
                }).to.throw('Middleware is not a function');

            });

        });

    });

});
