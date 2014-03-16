var expect = require('chai').expect;
var RouteMiddlewareManager = require('../lib/RouteMiddlewareManager');

describe('RouteMiddlewareManager', function () {

    beforeEach(function () {

        this.routeMiddlewareManager = new RouteMiddlewareManager();

        this.mockRouteA = {
            specification: '/testA'
        };

        this.mockRouteB = {
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
                    thisTest.routeMiddlewareManager.addMiddlewareForRoute(thisTest.mockRouteA, thisTest.validMiddlewareA)
                }).to.not.throw();

            });

            it('Should return an array of middleware when asked', function () {

                this.routeMiddlewareManager.addMiddlewareForRoute(this.mockRouteA, this.validMiddlewareA);
                expect(this.routeMiddlewareManager.getMiddlewareForRoute(this.mockRouteA)).to.deep.equal([this.validMiddlewareA]);

            });

        });

        describe('Multiple middleware for a single route', function () {

            beforeEach(function () {

                this.routeMiddlewareManager.addMiddlewareForRoute(this.mockRouteA, this.validMiddlewareA);
                this.routeMiddlewareManager.addMiddlewareForRoute(this.mockRouteA, this.validMiddlewareB);
                this.routeMiddlewareManager.addMiddlewareForRoute(this.mockRouteA, this.validMiddlewareC);

            });

            it('Should return the correct middleware array when asked', function () {

                expect(this.routeMiddlewareManager.getMiddlewareForRoute(this.mockRouteA)).to.deep.equal([this.validMiddlewareA, this.validMiddlewareB, this.validMiddlewareC]);

            });

        });

        describe('Multiple middleware for a multiple routes', function () {

            beforeEach(function () {

                this.routeMiddlewareManager.addMiddlewareForRoute(this.mockRouteA, this.validMiddlewareA);
                this.routeMiddlewareManager.addMiddlewareForRoute(this.mockRouteA, this.validMiddlewareB);
                this.routeMiddlewareManager.addMiddlewareForRoute(this.mockRouteB, this.validMiddlewareC);
                this.routeMiddlewareManager.addMiddlewareForRoute(this.mockRouteB, this.validMiddlewareD);

            });

            it('Should return the correct middleware arrays when asked', function () {

                expect(this.routeMiddlewareManager.getMiddlewareForRoute(this.mockRouteA)).to.deep.equal([this.validMiddlewareA, this.validMiddlewareB]);
                expect(this.routeMiddlewareManager.getMiddlewareForRoute(this.mockRouteB)).to.deep.equal([this.validMiddlewareC, this.validMiddlewareD]);

            });

        });

        describe('An invalid handler', function () {

            it('Should throw an exception', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.routeMiddlewareManager.addMiddlewareForRoute(thisTest.mockRouteA, thisTest.invalidMiddleware)
                }).to.throw('Middleware is not a function');

            });

        });

    });

    describe('When adding global middleware', function () {

        describe('A valid middleware', function () {

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

        describe('An invalid handler', function () {

            it('Should throw an exception', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.routeMiddlewareManager.addGlobalMiddleware(thisTest.invalidMiddleware)
                }).to.throw('Middleware is not a function');

            });

        });

    });

});
