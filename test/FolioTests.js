var _ = require('underscore');
var expect = require('chai').expect;
var sinon = require('sinon');
var mockery = require('mockery');


describe('Folio', function () {

    beforeEach(function () {

        var thisTest = this;

        this.RouteManager = function () {
            this.object = 'routeManager'
        };
        this.RouteMiddlewareManager = function () {
            this.object = 'routeMiddlewareManager'
        };
        this.RouteHandlerManager = function () {
            this.object = 'routeHandlerManager'
        };
        this.RequestHandler = function () {
            this.object = 'requestHandler'
        };
        this.HttpServer = function () {
            this.object = 'httpServer'
        };

        this.HttpServer.prototype.start = function(){
        };

        this.ProcessManager = function () {
            this.object = 'processManager'
        };

        this.ProcessManager.prototype.clusterize = function(){
        };

        /* ---------------------
         Mock MiddlewareCanister
         --------------------- */

        this.middlewareCaninsterInstance = {
            addMiddleware: function () {
            }
        };

        this.MiddlewareCanister = {
            new: function () {
                return thisTest.middlewareCaninsterInstance;
            }
        };

        /* ---------------------
         Mock RouteCanister
         --------------------- */

        this.routeCanisterInstance = {
        };

        this.RouteCanister = {
            new: function () {
                return thisTest.routeCanisterInstance;
            }
        };


        this.spies = {};
        this.spies.middlewareCaninsterInstanceAddMiddleware = sinon.spy(this.middlewareCaninsterInstance, 'addMiddleware');
        this.spies.middlewareCanisterNew = sinon.spy(this.MiddlewareCanister, 'new');
        this.spies.routeCanisterNew = sinon.spy(this.RouteCanister, 'new');
        this.spies.httpServerStart = sinon.spy(this.HttpServer.prototype, 'start');
        this.spies.processManagerClusterize = sinon.spy(this.ProcessManager.prototype, 'clusterize');



        mockery.deregisterAll();

        mockery.enable({
            warnOnReplace: false,
            useCleanCache: true
        });


        mockery.registerAllowable('../lib/Folio', true);
        mockery.registerAllowable('underscore');
        mockery.registerMock('./RouteManager', this.RouteManager);
        mockery.registerMock('./RouteMiddlewareManager', this.RouteMiddlewareManager);
        mockery.registerMock('./RouteHandlerManager', this.RouteHandlerManager);
        mockery.registerMock('./RouteCanister', this.RouteCanister);
        mockery.registerMock('./MiddlewareCanister', this.MiddlewareCanister);
        mockery.registerMock('./HttpServer', this.HttpServer);
        mockery.registerMock('./RequestHandler', this.RequestHandler);
        mockery.registerMock('./ProcessManager', this.ProcessManager);

        this.Folio = require('../lib/Folio');


    });

    afterEach(function () {
        _.each(this.spies, function (spy) {
            spy.restore();
        })
    });

    describe('On new', function () {

        beforeEach(function () {

            this.folio = new this.Folio();

        });

        it('Should have a route manager', function () {

            expect(this.folio._routeManager).to.not.be.undefined;


        });

        it('Should have a route middleware manager', function () {

            expect(this.folio._routeMiddlewareManager).to.not.be.undefined;

        });

        it('Should have a route handler manager', function () {

            expect(this.folio._routeHandlerManager).to.not.be.undefined;

        });

        it('Should have a request handler', function () {

            expect(this.folio._requestHandler).to.not.be.undefined;

        });

        it('Should have a http server', function () {

            expect(this.folio._httpServer).to.not.be.undefined;

        });

        it('Should have a process manager', function () {

            expect(this.folio._processManager).to.not.be.undefined;

        });

        describe('On use(middleware) with a single middleware', function () {

            beforeEach(function () {

                this.middlewareA = function () {
                };

                this.result = this.folio.use(this.middlewareA);

            });

            it('Should return a middleware canister', function () {

                expect(this.result).equal(this.middlewareCaninsterInstance);

            });

            it('The middleware should have been constructed correctly', function () {

                expect(this.MiddlewareCanister.new.callCount).to.equal(1);

            });

            it('Should add the middleware to the middleware canister', function () {

                expect(this.middlewareCaninsterInstance.addMiddleware.callCount).to.equal(1);
                expect(this.middlewareCaninsterInstance.addMiddleware.getCall(0).args).to.deep.equal([this.middlewareA]);

            });

        });

        describe('On use(middleware) with multiple middleware', function () {

            beforeEach(function () {

                this.middlewareA = function () {
                };

                this.middlewareB = function () {
                };

                this.result = this.folio.use(this.middlewareA, this.middlewareB);

            });

            it('Should return a middleware canister', function () {

                expect(this.result).equal(this.middlewareCaninsterInstance);

            });

            it('The middleware should have been constructed correctly', function () {

                expect(this.MiddlewareCanister.new.callCount).to.equal(1);

            });

            it('Should add the middleware to the middleware canister', function () {

                expect(this.middlewareCaninsterInstance.addMiddleware.callCount).to.equal(1);
                expect(this.middlewareCaninsterInstance.addMiddleware.getCall(0).args).to.deep.equal([this.middlewareA, this.middlewareB]);

            });

        });

        describe('On use(middleware) with no middleware', function () {

            it('Should throw an error', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.folio.use()
                }).to.throw('No middleware supplied');

            });

        });

        describe('On get(specification)', function () {

            beforeEach(function () {

                this.result = this.folio.get('/test/specification');

            });

            it('A route canister should have been constructed correctly', function () {

                expect(this.RouteCanister.new.callCount).to.equal(1);
                expect(this.RouteCanister.new.getCall(0).args).to.deep.equal([
                    'GET',
                    '/test/specification',
                    this.folio._routeManager,
                    this.folio._routeMiddlewareManager,
                    this.folio._routeHandlerManager
                ]);

            });

            it('Should return the route canister', function () {

                expect(this.result).to.deep.equal(this.routeCanisterInstance);

            });

        });

        describe('On start(port)', function(){

            beforeEach(function(){
                this.folio.start(1234);
            });

            it('Should delegate to the http server', function(){
                expect(this.HttpServer.prototype.start.callCount).to.equal(1);
            });

        });

        describe('On clusterize(clusterizedFunction)', function(){

            beforeEach(function(){
                this.clusterizeFunction = function(){
                };

                this.folio.clusterize(this.clusterizeFunction);
            });

            it('Should delegate to the processManager', function(){
                expect(this.ProcessManager.prototype.clusterize.callCount).to.equal(1);
                expect(this.ProcessManager.prototype.clusterize.getCall(0).args).to.deep.equal([this.clusterizeFunction]);
            });

        });

    });

});
