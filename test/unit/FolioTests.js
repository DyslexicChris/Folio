var _ = require('underscore');
var expect = require('chai').expect;
var sinon = require('sinon');
var mockery = require('mockery');


describe('Folio', function () {

    beforeEach(function () {

        var thisTest = this;

        this.RouteManager = function () {
            this.object = 'routeManager'
            this.reset = function () {
            };
        };
        this.RouteMiddlewareManager = function () {
            this.object = 'routeMiddlewareManager'
            this.reset = function () {
            };
        };
        this.RouteHandlerManager = function () {
            this.object = 'routeHandlerManager'
            this.reset = function () {
            };
        };
        this.RequestHandler = function () {
            this.object = 'requestHandler'
        };

        this.ObjectDecorator = function () {
            this.object = 'objectDecorator';
        };

        this.ObjectDecorator.prototype.addDecoration = function () {
        };

        this.SendObjectDecoration = function () {
            this.object = 'sendObjectDecorator'
        };

        this.HttpServer = function () {
            this.object = 'httpServer'
        };

        this.HttpServer.prototype.start = function (port, callback) {
            callback();
        };

        this.HttpServer.prototype.stop = function (callback) {
            callback();
        };

        this.ProcessManager = function () {
            this.object = 'processManager'
        };

        this.ProcessManager.prototype.cluster = function () {
        };

        this.JSONBodyParserMiddleware = function () {
        };

        this.JSONBodyParserFactory = function () {
        };

        this.JSONBodyParserFactory.prototype.newMiddleware = function () {
            return thisTest.JSONBodyParserMiddleware;
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
        this.spies.httpServerStop = sinon.spy(this.HttpServer.prototype, 'stop');
        this.spies.processManagerClusterize = sinon.spy(this.ProcessManager.prototype, 'cluster');
        this.spies.jsonBodyParserFactoryNewMiddleware = sinon.spy(this.JSONBodyParserFactory.prototype, 'newMiddleware');
        this.spies.objectDecoratorAddDecorator = sinon.spy(this.ObjectDecorator.prototype, 'addDecoration');

        mockery.deregisterAll();

        mockery.enable({
            warnOnReplace: false,
            useCleanCache: true
        });


        mockery.registerAllowable('../../lib/Folio', true);
        mockery.registerAllowable('underscore');
        mockery.registerMock('./RouteManager', this.RouteManager);
        mockery.registerMock('./RouteMiddlewareManager', this.RouteMiddlewareManager);
        mockery.registerMock('./RouteHandlerManager', this.RouteHandlerManager);
        mockery.registerMock('./RouteCanister', this.RouteCanister);
        mockery.registerMock('./MiddlewareCanister', this.MiddlewareCanister);
        mockery.registerMock('./HttpServer', this.HttpServer);
        mockery.registerMock('./RequestHandler', this.RequestHandler);
        mockery.registerMock('./ProcessManager', this.ProcessManager);
        mockery.registerMock('./middleware/JSONBodyParserFactory', this.JSONBodyParserFactory);
        mockery.registerMock('./decorators/ObjectDecorator', this.ObjectDecorator);
        mockery.registerMock('./decorators/response-decorations/SendObjectDecoration', this.SendObjectDecoration);

        this.Folio = require('../../lib/Folio');


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

        it('Should have a response decorator', function () {

            expect(this.folio._responseDecorator).to.not.be.undefined;

        });

        it('Should have a \'send object decoration\'', function () {

            expect(this.folio._sendObjectDecoration).to.not.be.undefined;

        });

        it('Should add the \'send object decoration\' to the response decorator', function () {

            expect(this.folio._responseDecorator.addDecoration.callCount).to.equal(1);
            expect(this.folio._responseDecorator.addDecoration.getCall(0).args).to.deep.equal([this.folio._sendObjectDecoration]);

        });

        it('Should have a http server', function () {

            expect(this.folio._httpServer).to.not.be.undefined;

        });

        it('Should have a process manager', function () {

            expect(this.folio._processManager).to.not.be.undefined;

        });

        it('Should have a JSON Body Parser factory', function () {

            expect(this.folio._jsonBodyParserFactory).to.not.be.undefined;

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

        describe('On post(specification)', function () {

            beforeEach(function () {

                this.result = this.folio.post('/test/specification');

            });

            it('A route canister should have been constructed correctly', function () {

                expect(this.RouteCanister.new.callCount).to.equal(1);
                expect(this.RouteCanister.new.getCall(0).args).to.deep.equal([
                    'POST',
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

        describe('On put(specification)', function () {

            beforeEach(function () {

                this.result = this.folio.put('/test/specification');

            });

            it('A route canister should have been constructed correctly', function () {

                expect(this.RouteCanister.new.callCount).to.equal(1);
                expect(this.RouteCanister.new.getCall(0).args).to.deep.equal([
                    'PUT',
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

        describe('On delete(specification)', function () {

            beforeEach(function () {

                this.result = this.folio.delete('/test/specification');

            });

            it('A route canister should have been constructed correctly', function () {

                expect(this.RouteCanister.new.callCount).to.equal(1);
                expect(this.RouteCanister.new.getCall(0).args).to.deep.equal([
                    'DELETE',
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

        describe('On head(specification)', function () {

            beforeEach(function () {

                this.result = this.folio.head('/test/specification');

            });

            it('A route canister should have been constructed correctly', function () {

                expect(this.RouteCanister.new.callCount).to.equal(1);
                expect(this.RouteCanister.new.getCall(0).args).to.deep.equal([
                    'HEAD',
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

        describe('On start(port, callback)', function () {

            beforeEach(function () {
                this.startCallback = function () {
                };
                this.folio.start(1234, this.startCallback);
            });

            it('Should delegate to the http server with the correct port', function () {
                expect(this.HttpServer.prototype.start.getCall(0).args[0]).to.equal(1234);
            });

            it('Should delegate to the http server with the correct completion function', function () {
                expect(this.HttpServer.prototype.start.getCall(0).args[1]).to.equal(this.startCallback);
            });
        });

        describe('On stop(callback)', function () {

            beforeEach(function () {
                this.stopCallback = function () {
                };
                this.folio.stop(this.stopCallback);
            });

            it('Should delegate to the http server with the correct completion function', function () {
                expect(this.HttpServer.prototype.stop.getCall(0).args[0]).to.equal(this.stopCallback);
            });
        });


        describe('On cluster(clusterizedFunction)', function () {

            beforeEach(function () {
                this.clusterizeFunction = function () {
                };

                this.folio.cluster(this.clusterizeFunction);
            });

            it('Should delegate to the processManager', function () {
                expect(this.ProcessManager.prototype.cluster.callCount).to.equal(1);
                expect(this.ProcessManager.prototype.cluster.getCall(0).args).to.deep.equal([this.clusterizeFunction]);
            });

        });

        describe('On jsonBodyParser()', function () {

            beforeEach(function () {

                this.middleware = this.folio.jsonBodyParser();

            });

            it('Should delegate to the JSON Body Parser factory', function () {

                expect(this.JSONBodyParserFactory.prototype.newMiddleware.callCount).to.equal(1);

            });

            it('Return the middleware returned by the JSON Body Parser factory', function () {

                expect(this.middleware).to.deep.equal(this.JSONBodyParserMiddleware);

            });

        });

        describe('On reset()', function () {

            beforeEach(function () {
                this.spies.routeManagerReset = sinon.spy(this.folio._routeManager, 'reset');
                this.spies.routeMiddlewareManagerReset = sinon.spy(this.folio._routeMiddlewareManager, 'reset');
                this.spies.routeHandlerManagerReset = sinon.spy(this.folio._routeHandlerManager, 'reset');

                this.folio.reset();
            });

            it('Should reset the route manager', function () {

                expect(this.folio._routeManager.reset.callCount).to.equal(1);

            });

            it('Should reset the route middleware manager', function () {

                expect(this.folio._routeMiddlewareManager.reset.callCount).to.equal(1);

            });

            it('Should reset the route handler manager', function () {

                expect(this.folio._routeHandlerManager.reset.callCount).to.equal(1);

            });

        });

    });

});
