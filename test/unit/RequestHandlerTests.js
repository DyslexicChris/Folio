var expect = require('chai').expect;
var assert = require('chai').assert;
var Stubs = require('./Helpers/Stubs');
var Assertions = require('./Helpers/Assertions');
var RequestHandler = require('../../lib/RequestHandler');

describe('RequestHandler', function () {

    describe('On new', function () {

        beforeEach(function () {

            this.mockRequest = Stubs.newRequest();
            this.mockRequest.url = '/my-mock-url/match?query=test';
            this.mockRequest.method = 'test';

            this.mockResponse = Stubs.newResponse();

            this.mockResponseDecorator = Stubs.newDecoration();
            this.mockRequestDecorator = Stubs.newDecoration();

            this.middleware = {};
            this.middleware.globalMiddlewareA = _newNoopMiddleware();
            this.middleware.globalMiddlewareB = _newNoopMiddleware();
            this.middleware.methodMiddlewareA = _newNoopMiddleware();
            this.middleware.methodMiddlewareB = _newNoopMiddleware();
            this.middleware.routeMiddlewareA = _newNoopMiddleware();
            this.middleware.routeMiddlewareB = _newNoopMiddleware();

            this.routeHandler = Stubs.newFunction();

            this.mockMatchedRoute = {
                method: 'test',
                specification: 'matchSpecification',
                params: { varA: 'test' }
            };

            this.mockRouteManager = Stubs.newRouteManager();
            this.mockRouteManager.query = Stubs.newFunction();
            this.mockRouteManager.query.withArgs('test', '/my-mock-url/match').returns(this.mockMatchedRoute);

            this.mockRouteMiddlewareManager = Stubs.newRouteMiddlewareManager();
            this.mockRouteMiddlewareManager.getGlobalMiddleware.returns([this.middleware.globalMiddlewareA, this.middleware.globalMiddlewareB]);
            this.mockRouteMiddlewareManager.getMiddlewareForMethod.withArgs('test').returns([this.middleware.methodMiddlewareA, this.middleware.methodMiddlewareB]);
            this.mockRouteMiddlewareManager.getMiddlewareForRoute.withArgs('test', 'matchSpecification').returns([this.middleware.routeMiddlewareA, this.middleware.routeMiddlewareB]);

            this.mockRouteHandlerManager = Stubs.newRouteHandlerManager();
            this.mockRouteHandlerManager.getHandlerForRoute.withArgs('test', 'matchSpecification').returns(this.routeHandler);

            this.requestHandler = new RequestHandler(this.mockRouteManager, this.mockRouteMiddlewareManager, this.mockRouteHandlerManager, this.mockRequestDecorator, this.mockResponseDecorator);

        });

        describe('When handling a request for a route that does not exist', function () {

            beforeEach(function () {

                this.mockRequest.url = '/my-mock-url/no-match?query=test';
                this.requestHandler.handle(this.mockRequest, this.mockResponse);

            });

            it('Should send a 404 response', function () {

                expect(this.mockResponse.statusCode).to.equal(404);
                assert(this.mockResponse.end.calledOnce);

            });

        });

        describe('When handling a request for a matched route with 2 global middleware, 2 method based middleware, 2 route based middleware but no handler', function () {

            beforeEach(function () {

                this.mockRouteHandlerManager.getHandlerForRoute = Stubs.newFunction();
                this.requestHandler.handle(this.mockRequest, this.mockResponse);

            });

            it('Should execute all global middleware', function () {

                assert(this.middleware.globalMiddlewareA.calledOnce);
                assert(this.middleware.globalMiddlewareB.calledOnce);

            });

            it('Should execute all method based middleware', function () {

                assert(this.middleware.methodMiddlewareA.calledOnce);
                assert(this.middleware.methodMiddlewareB.calledOnce);

            });

            it('Should execute all route based middleware', function () {

                assert(this.middleware.routeMiddlewareA.calledOnce);
                assert(this.middleware.routeMiddlewareB.calledOnce);

            });

            it('Should decorate the request using the request decorator', function () {

                assert(this.mockRequestDecorator.decorate.calledOnce);

            });

            it('Should decorate the response using the response decorator', function () {

                assert(this.mockResponseDecorator.decorate.calledOnce);

            });

            it('Should attach the route parameters to the request object', function () {

                expect(this.mockRequest.params).to.deep.equal({ varA: 'test' });

            });

            it('Should send a 501 response', function () {

                expect(this.mockResponse.statusCode).to.equal(501);
                assert(this.mockResponse.end.calledOnce);

            });

        });

        describe('When handling a request for a matched route with 2 global middleware, 2 method based middleware, 2 route based middleware and a single handler ', function () {

            beforeEach(function () {

                this.requestHandler.handle(this.mockRequest, this.mockResponse);

            });

            it('Should not handle the response itself', function () {

                assert(this.mockResponse.end.notCalled);

            });

            it('Should execute all global middleware', function () {

                assert(this.middleware.globalMiddlewareA.calledOnce);
                assert(this.middleware.globalMiddlewareB.calledOnce);

            });

            it('Should execute all method based middleware', function () {

                assert(this.middleware.methodMiddlewareA.calledOnce);
                assert(this.middleware.methodMiddlewareB.calledOnce);

            });

            it('Should execute all route based middleware', function () {

                assert(this.middleware.routeMiddlewareA.calledOnce);
                assert(this.middleware.routeMiddlewareB.calledOnce);

            });

            it('Should decorate the request using the request decorator', function () {

                assert(this.mockRequestDecorator.decorate.calledOnce);

            });

            it('Should decorate the response using the response decorator', function () {

                assert(this.mockResponseDecorator.decorate.calledOnce);

            });

            it('Should attach the route parameters to the request object', function () {

                expect(this.mockRequest.params).to.deep.equal({ varA: 'test' });
            });

            it('Should execute the route handler', function () {

                assert(this.routeHandler.calledOnce);

            });

        });

        describe('When handling a request for a matched route with no global middleware, 2 method based middleware, 2 route based middleware and a single handler ', function () {

            beforeEach(function () {

                this.mockRouteMiddlewareManager.getGlobalMiddleware = Stubs.newFunction();
                this.requestHandler.handle(this.mockRequest, this.mockResponse);

            });

            it('Should not handle the response itself', function () {

                assert(this.mockResponse.end.notCalled);

            });

            it('Should execute all method based middleware', function () {

                assert(this.middleware.methodMiddlewareA.calledOnce);
                assert(this.middleware.methodMiddlewareB.calledOnce);

            });

            it('Should execute all route based middleware', function () {

                assert(this.middleware.routeMiddlewareA.calledOnce);
                assert(this.middleware.routeMiddlewareB.calledOnce);

            });

            it('Should decorate the request using the request decorator', function () {

                assert(this.mockRequestDecorator.decorate.calledOnce);

            });

            it('Should decorate the response using the response decorator', function () {

                assert(this.mockResponseDecorator.decorate.calledOnce);

            });

            it('Should attach the route parameters to the request object', function () {

                expect(this.mockRequest.params).to.deep.equal({ varA: 'test' });
            });

            it('Should execute the route handler', function () {

                assert(this.routeHandler.calledOnce);

            });

        });

        describe('When handling a request for a matched route with 2 global middleware, no method based middleware, 2 route based middleware and a single handler ', function () {

            beforeEach(function () {

                this.mockRouteMiddlewareManager.getMiddlewareForMethod = Stubs.newFunction();
                this.requestHandler.handle(this.mockRequest, this.mockResponse);

            });

            it('Should not handle the response itself', function () {

                assert(this.mockResponse.end.notCalled);

            });

            it('Should execute all global middleware', function () {

                assert(this.middleware.globalMiddlewareA.calledOnce);
                assert(this.middleware.globalMiddlewareB.calledOnce);

            });

            it('Should execute all route based middleware', function () {

                assert(this.middleware.routeMiddlewareA.calledOnce);
                assert(this.middleware.routeMiddlewareB.calledOnce);

            });

            it('Should decorate the request using the request decorator', function () {

                assert(this.mockRequestDecorator.decorate.calledOnce);

            });

            it('Should decorate the response using the response decorator', function () {

                assert(this.mockResponseDecorator.decorate.calledOnce);

            });

            it('Should attach the route parameters to the request object', function () {

                expect(this.mockRequest.params).to.deep.equal({ varA: 'test' });
            });

            it('Should execute the route handler', function () {

                assert(this.routeHandler.calledOnce);

            });

        });

        describe('When handling a request for a matched route with 2 global middleware, 2 method based middleware, no route based middleware and a single handler ', function () {

            beforeEach(function () {

                this.mockRouteMiddlewareManager.getMiddlewareForRoute = Stubs.newFunction();
                this.requestHandler.handle(this.mockRequest, this.mockResponse);

            });

            it('Should not handle the response itself', function () {

                assert(this.mockResponse.end.notCalled);

            });

            it('Should execute all global middleware', function () {

                assert(this.middleware.globalMiddlewareA.calledOnce);
                assert(this.middleware.globalMiddlewareB.calledOnce);

            });

            it('Should execute all method based middleware', function () {

                assert(this.middleware.methodMiddlewareA.calledOnce);
                assert(this.middleware.methodMiddlewareB.calledOnce);

            });

            it('Should decorate the request using the request decorator', function () {

                assert(this.mockRequestDecorator.decorate.calledOnce);

            });

            it('Should decorate the response using the response decorator', function () {

                assert(this.mockResponseDecorator.decorate.calledOnce);

            });

            it('Should attach the route parameters to the request object', function () {

                expect(this.mockRequest.params).to.deep.equal({ varA: 'test' });

            });

            it('Should execute the route handler', function () {

                assert(this.routeHandler.calledOnce);

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

    var middleware = Stubs.newFunction();
    middleware.callsArg(2);

    return middleware;
}
