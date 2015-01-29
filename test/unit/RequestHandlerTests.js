var expect = require('chai').expect;
var sinon = require('sinon');
var _ = require('underscore');
var RequestHandler = require('../../lib/RequestHandler');

describe('RequestHandler', function () {

    beforeEach(function () {

        this.spies = {};

    });

    afterEach(function () {
        _.each(this.spies, function (spy) {
            spy.restore();
        })
    });

    describe('On new', function () {

        beforeEach(function () {

            var thisTest = this;

            this.mockRouteManager = {
                object: 'mockRouteManager'
            };

            this.mockRouteMiddlewareManager = {
                object: 'mockRouteMiddlewareManager'
            };

            this.mockRouteHandlerManager = {
                object: 'mockRouteHandlerManager'
            };

            this.mockRequest = {
                url: '/my-mock-url/match?query=test',
                method: 'test'
            };

            this.mockResponse = {
                end: function () {
                }
            };

            this.mockMathedRoute = {
                method: 'test',
                specification: 'matchSpecification',
                params: { varA: 'test' }
            };

            this.mockRouteManager.query = function (method, path) {
                if (method == 'test' && path == '/my-mock-url/match') {
                    return thisTest.mockMathedRoute;
                }
            };

            this.mockResponseDecorator = {
                decorate: function () {
                }
            };

            this.mockRequestDecorator = {
                decorate: function () {

                }
            };

            this.middleware = {
            };

            this.middleware.globalMiddlewareA = _newNoopMiddleware();
            this.middleware.globalMiddlewareB = _newNoopMiddleware();
            this.middleware.methodMiddlewareA = _newNoopMiddleware();
            this.middleware.methodMiddlewareB = _newNoopMiddleware();
            this.middleware.routeMiddlewareA = _newNoopMiddleware();
            this.middleware.routeMiddlewareB = _newNoopMiddleware();
            this.routeHandler = function () {
            };

            this.mockRouteMiddlewareManager.getGlobalMiddleware = function () {
                return [thisTest.middleware.globalMiddlewareA, thisTest.middleware.globalMiddlewareB];
            };

            this.mockRouteMiddlewareManager.getMiddlewareForMethod = function (method) {
                if (method == 'test') {
                    return [thisTest.middleware.methodMiddlewareA, thisTest.middleware.methodMiddlewareB];
                }
            };

            this.mockRouteMiddlewareManager.getMiddlewareForRoute = function (method, specification) {
                if (method == 'test' && specification == 'matchSpecification') {
                    return [thisTest.middleware.routeMiddlewareA, thisTest.middleware.routeMiddlewareB];
                }
            };

            this.mockRouteHandlerManager.getHandlerForRoute = function (method, specification) {
                if (method == 'test' && specification == 'matchSpecification') {
                    return thisTest.routeHandler;
                }
            };

            this.spies.globalMiddlewareA = sinon.spy(this.middleware, 'globalMiddlewareA');
            this.spies.globalMiddlewareB = sinon.spy(this.middleware, 'globalMiddlewareB');
            this.spies.methodMiddlewareA = sinon.spy(this.middleware, 'methodMiddlewareA');
            this.spies.methodMiddlewareB = sinon.spy(this.middleware, 'methodMiddlewareB');
            this.spies.routeMiddlewareA = sinon.spy(this.middleware, 'routeMiddlewareA');
            this.spies.routeMiddlewareB = sinon.spy(this.middleware, 'routeMiddlewareB');
            this.spies.routeHandler = sinon.spy(this, 'routeHandler');
            this.spies.responseEnd = sinon.spy(this.mockResponse, 'end');
            this.spies.responseDecoratorDecorate = sinon.spy(this.mockResponseDecorator, 'decorate');
            this.spies.requestDecoratorDecorate = sinon.spy(this.mockRequestDecorator, 'decorate');

            this.requestHandler = new RequestHandler(this.mockRouteManager, this.mockRouteMiddlewareManager, this.mockRouteHandlerManager, this.mockRequestDecorator, this.mockResponseDecorator);

        });

        it('Should have a route manager', function () {

            expect(this.requestHandler._routeManager).to.deep.equal(this.mockRouteManager);

        });

        it('Should have a route middleware manager', function () {

            expect(this.requestHandler._routeMiddlewareManager).to.deep.equal(this.mockRouteMiddlewareManager);

        });

        it('Should have a route handler manager', function () {

            expect(this.requestHandler._routeHandlerManager).to.deep.equal(this.mockRouteHandlerManager);

        });

        it('Should have a response decorator', function () {

            expect(this.requestHandler._responseDecorator).to.not.equal(undefined)

        });

        describe('When handling a request for a route that does not exist', function () {

            beforeEach(function () {

                this.mockRequest = {
                    url: '/my-mock-url/no-match?query=test'
                };

                this.requestHandler.handle(this.mockRequest, this.mockResponse);

            });

            it('Should send a 404 response', function () {

                expect(this.mockResponse.statusCode).to.equal(404);
                expect(this.mockResponse.end.callCount).to.equal(1);

            });

        });

        describe('When handling a request for a matched route with 2 global middleware, 2 method based middleware, 2 route based middleware but no handler', function () {

            beforeEach(function () {

                this.mockRouteHandlerManager.getHandlerForRoute = function (method, specification) {
                };

                this.requestHandler.handle(this.mockRequest, this.mockResponse);

            });

            it('Should execute all global middleware', function () {

                expect(this.middleware.globalMiddlewareA.callCount).to.equal(1);
                expect(this.middleware.globalMiddlewareB.callCount).to.equal(1);

            });

            it('Should execute all method based middleware', function () {

                expect(this.middleware.methodMiddlewareA.callCount).to.equal(1);
                expect(this.middleware.methodMiddlewareB.callCount).to.equal(1);

            });

            it('Should execute all route based middleware', function () {

                expect(this.middleware.routeMiddlewareA.callCount).to.equal(1);
                expect(this.middleware.routeMiddlewareB.callCount).to.equal(1);

            });

            it('Should decorate the request using the request decorator', function () {

                expect(this.mockRequestDecorator.decorate.callCount).to.equal(1);

            });

            it('Should decorate the response using the response decorator', function () {

                expect(this.mockResponseDecorator.decorate.callCount).to.equal(1);

            });

            it('Should attach the route parameters to the request object', function () {

                expect(this.mockRequest.params).to.deep.equal({ varA: 'test' });
            });

            it('Should send a 501 response', function () {

                expect(this.mockResponse.statusCode).to.equal(501);
                expect(this.mockResponse.end.callCount).to.equal(1);

            });

        });

        describe('When handling a request for a matched route with 2 global middleware, 2 method based middleware, 2 route based middleware and a single handler ', function () {

            beforeEach(function () {

                this.requestHandler.handle(this.mockRequest, this.mockResponse);

            });

            it('Should not handle the response itself', function () {

                expect(this.mockResponse.end.callCount).to.equal(0);

            });

            it('Should execute all global middleware', function () {

                expect(this.middleware.globalMiddlewareA.callCount).to.equal(1);
                expect(this.middleware.globalMiddlewareB.callCount).to.equal(1);

            });

            it('Should execute all method based middleware', function () {

                expect(this.middleware.methodMiddlewareA.callCount).to.equal(1);
                expect(this.middleware.methodMiddlewareB.callCount).to.equal(1);

            });

            it('Should execute all route based middleware', function () {

                expect(this.middleware.routeMiddlewareA.callCount).to.equal(1);
                expect(this.middleware.routeMiddlewareB.callCount).to.equal(1);

            });

            it('Should decorate the request using the request decorator', function () {

                expect(this.mockRequestDecorator.decorate.callCount).to.equal(1);

            });

            it('Should decorate the response using the response decorator', function () {

                expect(this.mockResponseDecorator.decorate.callCount).to.equal(1);

            });

            it('Should attach the route parameters to the request object', function () {

                expect(this.mockRequest.params).to.deep.equal({ varA: 'test' });
            });

            it('Should execute the route handler', function () {

                expect(this.routeHandler.callCount).to.equal(1);

            });

        });

        describe('When handling a request for a matched route with no global middleware, 2 method based middleware, 2 route based middleware and a single handler ', function () {

            beforeEach(function () {

                this.mockRouteMiddlewareManager.getGlobalMiddleware = function () {
                };

                this.requestHandler.handle(this.mockRequest, this.mockResponse);

            });

            it('Should not handle the response itself', function () {

                expect(this.mockResponse.end.callCount).to.equal(0);

            });

            it('Should execute all method based middleware', function () {

                expect(this.middleware.methodMiddlewareA.callCount).to.equal(1);
                expect(this.middleware.methodMiddlewareB.callCount).to.equal(1);

            });

            it('Should execute all route based middleware', function () {

                expect(this.middleware.routeMiddlewareA.callCount).to.equal(1);
                expect(this.middleware.routeMiddlewareB.callCount).to.equal(1);

            });

            it('Should decorate the request using the request decorator', function () {

                expect(this.mockRequestDecorator.decorate.callCount).to.equal(1);

            });

            it('Should decorate the response using the response decorator', function () {

                expect(this.mockResponseDecorator.decorate.callCount).to.equal(1);

            });

            it('Should attach the route parameters to the request object', function () {

                expect(this.mockRequest.params).to.deep.equal({ varA: 'test' });
            });

            it('Should execute the route handler', function () {

                expect(this.routeHandler.callCount).to.equal(1);

            });

        });

        describe('When handling a request for a matched route with 2 global middleware, no method based middleware, 2 route based middleware and a single handler ', function () {

            beforeEach(function () {

                this.mockRouteMiddlewareManager.getMiddlewareForMethod = function (method) {
                };

                this.requestHandler.handle(this.mockRequest, this.mockResponse);

            });

            it('Should not handle the response itself', function () {

                expect(this.mockResponse.end.callCount).to.equal(0);

            });

            it('Should execute all global middleware', function () {

                expect(this.middleware.globalMiddlewareA.callCount).to.equal(1);
                expect(this.middleware.globalMiddlewareB.callCount).to.equal(1);

            });

            it('Should execute all route based middleware', function () {

                expect(this.middleware.routeMiddlewareA.callCount).to.equal(1);
                expect(this.middleware.routeMiddlewareB.callCount).to.equal(1);

            });

            it('Should decorate the request using the request decorator', function () {

                expect(this.mockRequestDecorator.decorate.callCount).to.equal(1);

            });

            it('Should decorate the response using the response decorator', function () {

                expect(this.mockResponseDecorator.decorate.callCount).to.equal(1);

            });

            it('Should attach the route parameters to the request object', function () {

                expect(this.mockRequest.params).to.deep.equal({ varA: 'test' });
            });

            it('Should execute the route handler', function () {

                expect(this.routeHandler.callCount).to.equal(1);

            });

        });

        describe('When handling a request for a matched route with 2 global middleware, 2 method based middleware, no route based middleware and a single handler ', function () {

            beforeEach(function () {

                this.mockRouteMiddlewareManager.getMiddlewareForRoute = function (method, specification) {
                };

                this.requestHandler.handle(this.mockRequest, this.mockResponse);

            });

            it('Should not handle the response itself', function () {

                expect(this.mockResponse.end.callCount).to.equal(0);

            });

            it('Should execute all global middleware', function () {

                expect(this.middleware.globalMiddlewareA.callCount).to.equal(1);
                expect(this.middleware.globalMiddlewareB.callCount).to.equal(1);

            });

            it('Should execute all method based middleware', function () {

                expect(this.middleware.methodMiddlewareA.callCount).to.equal(1);
                expect(this.middleware.methodMiddlewareB.callCount).to.equal(1);

            });

            it('Should decorate the request using the request decorator', function () {

                expect(this.mockRequestDecorator.decorate.callCount).to.equal(1);

            });

            it('Should decorate the response using the response decorator', function () {

                expect(this.mockResponseDecorator.decorate.callCount).to.equal(1);

            });

            it('Should attach the route parameters to the request object', function () {

                expect(this.mockRequest.params).to.deep.equal({ varA: 'test' });
            });

            it('Should execute the route handler', function () {

                expect(this.routeHandler.callCount).to.equal(1);

            });

        });

    });

});


/**
 * Returns a new middleware that does nothing other than call next().
 *
 * @returns {Function}
 * @private
 */
function _newNoopMiddleware() {
    'use strict';

    return function (request, response, next) {
        next();
    };
}
