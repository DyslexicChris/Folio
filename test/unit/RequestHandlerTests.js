var expect = require('chai').expect;
var sinon = require('sinon');
var _ = require('underscore');
var RequestHandler = require('../../lib/RequestHandler');

describe('RequestHandler', function () {

    beforeEach(function(){

        this.spies = {};

    });

    afterEach(function () {
        _.each(this.spies, function (spy) {
            spy.restore();
        })
    });

    describe('On new', function(){

        beforeEach(function () {


            this.mockRouteManager = {
                object: 'mockRouteManager'
            };

            this.mockRouteMiddlewareManager = {
                object: 'mockRouteMiddlewareManager'
            };

            this.mockRouteHandlerManager = {
                object: 'mockRouteHandlerManager'
            };

            this.requestHandler = new RequestHandler(this.mockRouteManager, this.mockRouteMiddlewareManager, this.mockRouteHandlerManager);

        });

        it('Should have a route manager', function(){

            expect(this.requestHandler._routeManager).to.deep.equal(this.mockRouteManager);

        });

        it('Should have a route middleware manager', function(){

            expect(this.requestHandler._routeMiddlewareManager).to.deep.equal(this.mockRouteMiddlewareManager);

        });

        it('Should have a route handler manager', function(){

            expect(this.requestHandler._routeHandlerManager).to.deep.equal(this.mockRouteHandlerManager);

        });

        describe('When handling a request for a route that does not exist', function(){

            beforeEach(function(){

                this.mockRequest = {
                    url: '/my-mock-url/no-match?query=test'
                };

                this.mockResponse = {
                    end: function(){
                    }
                };

                this.spies.responseEnd = sinon.spy(this.mockResponse, 'end');

                this.mockRouteManager.query = function(method, path){
                };

                this.requestHandler.handle(this.mockRequest, this.mockResponse);

            });

            it('Should send a 404 response', function(){

                expect(this.mockResponse.statusCode).to.equal(404);
                expect(this.mockResponse.end.callCount).to.equal(1);

            });

        });

        describe('When handling a request for a matched route with 2 global middleware, 2 method based middleware, 2 route based middleware and a single handler ', function(){

            beforeEach(function(){

                var thisTest = this;

                this.mockRequest = {
                    url: '/my-mock-url/match?query=test',
                    method:'test'
                };

                this.mockResponse = {
                    end: function(){
                    }
                };

                this.spies.responseEnd = sinon.spy(this.mockResponse, 'end');

                this.mockMathedRoute = {
                    specification: 'matchSpecification'
                };

                this.mockRouteManager.query = function(method, path){
                    if(method == 'test' && path == '/my-mock-url/match'){
                        return thisTest.mockMathedRoute;
                    }
                };

                this.middleware = {
                };

                this.middleware.globalMiddlewareA = function(request, response, next){
                    next();
                };

                this.spies.globalMiddlewareA = sinon.spy(this.middleware, 'globalMiddlewareA');

                this.middleware.globalMiddlewareB = function(request, response, next){
                    next();
                };

                this.spies.globalMiddlewareB = sinon.spy(this.middleware, 'globalMiddlewareB');

                this.middleware.methodMiddlewareA = function(request, response, next){
                    next();
                };

                this.spies.methodMiddlewareA = sinon.spy(this.middleware, 'methodMiddlewareA');

                this.middleware.methodMiddlewareB = function(request, response, next){
                    next();
                };

                this.spies.methodMiddlewareB = sinon.spy(this.middleware, 'methodMiddlewareB');

                this.middleware.routeMiddlewareA = function(request, response, next){
                    next();
                };

                this.spies.routeMiddlewareA = sinon.spy(this.middleware, 'routeMiddlewareA');

                this.middleware.routeMiddlewareB = function(request, response, next){
                    next();
                };

                this.spies.routeMiddlewareB = sinon.spy(this.middleware, 'routeMiddlewareB');

                this.routeHandler = function(){
                };

                this.spies.routeHandler = sinon.spy(this, 'routeHandler');


                this.mockRouteMiddlewareManager.getGlobalMiddleware = function(){
                    return [thisTest.middleware.globalMiddlewareA, thisTest.middleware.globalMiddlewareB];
                };

                this.mockRouteMiddlewareManager.getMiddlewareForMethod = function(method){
                    if(method == 'test'){
                        return [thisTest.middleware.methodMiddlewareA, thisTest.middleware.methodMiddlewareB];
                    }
                };

                this.mockRouteMiddlewareManager.getMiddlewareForRoute = function(method, specification){
                    if(method == 'test' && specification == 'matchSpecification') {
                        return [thisTest.middleware.routeMiddlewareA, thisTest.middleware.routeMiddlewareB];
                    }
                };

                this.mockRouteHandlerManager.getHandlerForRoute = function(method, specification){
                    if(method == 'test' && specification == 'matchSpecification') {
                        return thisTest.routeHandler;
                    }
                };


                this.requestHandler.handle(this.mockRequest, this.mockResponse);


            });

            it('Should not handle the response itself', function(){

                expect(this.mockResponse.end.callCount).to.equal(0);

            });

            it('Should execute all global middleware', function(){

                expect(this.middleware.globalMiddlewareA.callCount).to.equal(1);
                expect(this.middleware.globalMiddlewareB.callCount).to.equal(1);

            });

            it('Should execute all method based middleware', function(){

                expect(this.middleware.methodMiddlewareA.callCount).to.equal(1);
                expect(this.middleware.methodMiddlewareB.callCount).to.equal(1);

            });

            it('Should execute all route based middleware', function(){

                expect(this.middleware.routeMiddlewareA.callCount).to.equal(1);
                expect(this.middleware.routeMiddlewareB.callCount).to.equal(1);

            });

            it('Should execute the route handler', function(){

                expect(this.routeHandler.callCount).to.equal(1);

            });

        });

        describe('When handling a request for a matched route with no global middleware, 2 method based middleware, 2 route based middleware and a single handler ', function(){

            beforeEach(function(){

                var thisTest = this;

                this.mockRequest = {
                    url: '/my-mock-url/match?query=test',
                    method:'test'
                };

                this.mockResponse = {
                    end: function(){
                    }
                };

                this.spies.responseEnd = sinon.spy(this.mockResponse, 'end');

                this.mockMathedRoute = {
                    specification: 'matchSpecification'
                };

                this.mockRouteManager.query = function(method, path){
                    if(method == 'test' && path == '/my-mock-url/match'){
                        return thisTest.mockMathedRoute;
                    }
                };

                this.middleware = {
                };

                this.middleware.methodMiddlewareA = function(request, response, next){
                    next();
                };

                this.spies.methodMiddlewareA = sinon.spy(this.middleware, 'methodMiddlewareA');

                this.middleware.methodMiddlewareB = function(request, response, next){
                    next();
                };

                this.spies.methodMiddlewareB = sinon.spy(this.middleware, 'methodMiddlewareB');

                this.middleware.routeMiddlewareA = function(request, response, next){
                    next();
                };

                this.spies.routeMiddlewareA = sinon.spy(this.middleware, 'routeMiddlewareA');

                this.middleware.routeMiddlewareB = function(request, response, next){
                    next();
                };

                this.spies.routeMiddlewareB = sinon.spy(this.middleware, 'routeMiddlewareB');

                this.routeHandler = function(){
                };

                this.spies.routeHandler = sinon.spy(this, 'routeHandler');


                this.mockRouteMiddlewareManager.getGlobalMiddleware = function(){
                };

                this.mockRouteMiddlewareManager.getMiddlewareForMethod = function(method){
                    if(method == 'test'){
                        return [thisTest.middleware.methodMiddlewareA, thisTest.middleware.methodMiddlewareB];
                    }
                };

                this.mockRouteMiddlewareManager.getMiddlewareForRoute = function(method, specification){
                    if(method == 'test' && specification == 'matchSpecification') {
                        return [thisTest.middleware.routeMiddlewareA, thisTest.middleware.routeMiddlewareB];
                    }
                };

                this.mockRouteHandlerManager.getHandlerForRoute = function(method, specification){
                    if(method == 'test' && specification == 'matchSpecification') {
                        return thisTest.routeHandler;
                    }
                };


                this.requestHandler.handle(this.mockRequest, this.mockResponse);


            });

            it('Should not handle the response itself', function(){

                expect(this.mockResponse.end.callCount).to.equal(0);

            });


            it('Should execute all method based middleware', function(){

                expect(this.middleware.methodMiddlewareA.callCount).to.equal(1);
                expect(this.middleware.methodMiddlewareB.callCount).to.equal(1);

            });

            it('Should execute all route based middleware', function(){

                expect(this.middleware.routeMiddlewareA.callCount).to.equal(1);
                expect(this.middleware.routeMiddlewareB.callCount).to.equal(1);

            });

            it('Should execute the route handler', function(){

                expect(this.routeHandler.callCount).to.equal(1);

            });

        });

        describe('When handling a request for a matched route with 2 global middleware, no method based middleware, 2 route based middleware and a single handler ', function(){

            beforeEach(function(){

                var thisTest = this;

                this.mockRequest = {
                    url: '/my-mock-url/match?query=test',
                    method:'test'
                };

                this.mockResponse = {
                    end: function(){
                    }
                };

                this.spies.responseEnd = sinon.spy(this.mockResponse, 'end');

                this.mockMathedRoute = {
                    specification: 'matchSpecification'
                };

                this.mockRouteManager.query = function(method, path){
                    if(method == 'test' && path == '/my-mock-url/match'){
                        return thisTest.mockMathedRoute;
                    }
                };

                this.middleware = {
                };

                this.middleware.globalMiddlewareA = function(request, response, next){
                    next();
                };

                this.spies.globalMiddlewareA = sinon.spy(this.middleware, 'globalMiddlewareA');

                this.middleware.globalMiddlewareB = function(request, response, next){
                    next();
                };

                this.spies.globalMiddlewareB = sinon.spy(this.middleware, 'globalMiddlewareB');

                this.middleware.routeMiddlewareA = function(request, response, next){
                    next();
                };

                this.spies.routeMiddlewareA = sinon.spy(this.middleware, 'routeMiddlewareA');

                this.middleware.routeMiddlewareB = function(request, response, next){
                    next();
                };

                this.spies.routeMiddlewareB = sinon.spy(this.middleware, 'routeMiddlewareB');

                this.routeHandler = function(){
                };

                this.spies.routeHandler = sinon.spy(this, 'routeHandler');


                this.mockRouteMiddlewareManager.getGlobalMiddleware = function(){
                    return [thisTest.middleware.globalMiddlewareA, thisTest.middleware.globalMiddlewareB];
                };

                this.mockRouteMiddlewareManager.getMiddlewareForMethod = function(method){
                };

                this.mockRouteMiddlewareManager.getMiddlewareForRoute = function(method, specification){
                    if(method == 'test' && specification == 'matchSpecification') {
                        return [thisTest.middleware.routeMiddlewareA, thisTest.middleware.routeMiddlewareB];
                    }
                };

                this.mockRouteHandlerManager.getHandlerForRoute = function(method, specification){
                    if(method == 'test' && specification == 'matchSpecification') {
                        return thisTest.routeHandler;
                    }
                };


                this.requestHandler.handle(this.mockRequest, this.mockResponse);


            });

            it('Should not handle the response itself', function(){

                expect(this.mockResponse.end.callCount).to.equal(0);

            });

            it('Should execute all global middleware', function(){

                expect(this.middleware.globalMiddlewareA.callCount).to.equal(1);
                expect(this.middleware.globalMiddlewareB.callCount).to.equal(1);

            });

            it('Should execute all route based middleware', function(){

                expect(this.middleware.routeMiddlewareA.callCount).to.equal(1);
                expect(this.middleware.routeMiddlewareB.callCount).to.equal(1);

            });

            it('Should execute the route handler', function(){

                expect(this.routeHandler.callCount).to.equal(1);

            });

        });

        describe('When handling a request for a matched route with 2 global middleware, 2 method based middleware, no route based middleware and a single handler ', function(){

            beforeEach(function(){

                var thisTest = this;

                this.mockRequest = {
                    url: '/my-mock-url/match?query=test',
                    method:'test'
                };

                this.mockResponse = {
                    end: function(){
                    }
                };

                this.spies.responseEnd = sinon.spy(this.mockResponse, 'end');

                this.mockMathedRoute = {
                    specification: 'matchSpecification'
                };

                this.mockRouteManager.query = function(method, path){
                    if(method == 'test' && path == '/my-mock-url/match'){
                        return thisTest.mockMathedRoute;
                    }
                };

                this.middleware = {
                };

                this.middleware.globalMiddlewareA = function(request, response, next){
                    next();
                };

                this.spies.globalMiddlewareA = sinon.spy(this.middleware, 'globalMiddlewareA');

                this.middleware.globalMiddlewareB = function(request, response, next){
                    next();
                };

                this.spies.globalMiddlewareB = sinon.spy(this.middleware, 'globalMiddlewareB');

                this.middleware.methodMiddlewareA = function(request, response, next){
                    next();
                };

                this.spies.methodMiddlewareA = sinon.spy(this.middleware, 'methodMiddlewareA');

                this.middleware.methodMiddlewareB = function(request, response, next){
                    next();
                };

                this.spies.methodMiddlewareB = sinon.spy(this.middleware, 'methodMiddlewareB');

                this.routeHandler = function(){
                };

                this.spies.routeHandler = sinon.spy(this, 'routeHandler');


                this.mockRouteMiddlewareManager.getGlobalMiddleware = function(){
                    return [thisTest.middleware.globalMiddlewareA, thisTest.middleware.globalMiddlewareB];
                };

                this.mockRouteMiddlewareManager.getMiddlewareForMethod = function(method){
                    if(method == 'test'){
                        return [thisTest.middleware.methodMiddlewareA, thisTest.middleware.methodMiddlewareB];
                    }
                };

                this.mockRouteMiddlewareManager.getMiddlewareForRoute = function(method, specification){
                };

                this.mockRouteHandlerManager.getHandlerForRoute = function(method, specification){
                    if(method == 'test' && specification == 'matchSpecification') {
                        return thisTest.routeHandler;
                    }
                };


                this.requestHandler.handle(this.mockRequest, this.mockResponse);


            });

            it('Should not handle the response itself', function(){

                expect(this.mockResponse.end.callCount).to.equal(0);

            });

            it('Should execute all global middleware', function(){

                expect(this.middleware.globalMiddlewareA.callCount).to.equal(1);
                expect(this.middleware.globalMiddlewareB.callCount).to.equal(1);

            });

            it('Should execute all method based middleware', function(){

                expect(this.middleware.methodMiddlewareA.callCount).to.equal(1);
                expect(this.middleware.methodMiddlewareB.callCount).to.equal(1);

            });

            it('Should execute the route handler', function(){

                expect(this.routeHandler.callCount).to.equal(1);

            });

        });

    });

});
