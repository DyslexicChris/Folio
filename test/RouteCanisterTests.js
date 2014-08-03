var expect = require('chai').expect;
var sinon = require('sinon');
var _ = require('underscore');
var RouteCanister = require('../lib/RouteCanister');

describe('RouteCanister', function () {

    beforeEach(function () {

        this.mockMethod = 'put';
        this.mockSpecification = '/test/specification';

        this.mockRouteManager = {
            addRoute: function () {
            }
        };

        this.mockRouteMiddlewareManager = {
            addMiddlewareForRoute: function () {
            }
        };

        this.mockRouteHandlerManager = {
            addHandlerForRoute: function () {
            }
        };

        this.mockMiddlewareA = function () {
        };

        this.mockMiddlewareB = function () {
        };

        this.mockMiddlewareC = function () {
        };

        this.mockHandler = function () {
        };

        this.spies = {};
        this.spies.routeManagerAddRoute = sinon.spy(this.mockRouteManager, 'addRoute');
        this.spies.routeMiddlewareManagerAddMiddlewareForRoute = sinon.spy(this.mockRouteMiddlewareManager, 'addMiddlewareForRoute');
        this.spies.routeHandlerManagerAddHandlerForRoute = sinon.spy(this.mockRouteHandlerManager, 'addHandlerForRoute');

    });

    afterEach(function () {
        _.each(this.spies, function (spy) {
            spy.reset();
            spy.restore();
        })
    });

    describe('On new using using the RouteCanister.new() method', function () {

        beforeEach(function () {

            this.routeCanister = RouteCanister.new(this.mockMethod, this.mockSpecification, this.mockRouteManager, this.mockRouteMiddlewareManager, this.mockRouteHandlerManager);

        });

        it('Should have its method set', function () {

            expect(this.routeCanister.getMethod()).to.equal(this.mockMethod);

        });

        it('Should have its specification set', function () {

            expect(this.routeCanister.getSpecification()).to.equal(this.mockSpecification);

        });

        it('Should have its route manager set', function () {

            expect(this.routeCanister._routeManager).to.deep.equal(this.mockRouteManager);

        });

        it('Should have its route middleware manager set', function () {

            expect(this.routeCanister._routeMiddlewareManager).to.deep.equal(this.mockRouteMiddlewareManager);

        });

        it('Should have its route handler manager set', function () {

            expect(this.routeCanister._routeHandlerManager).to.deep.equal(this.mockRouteHandlerManager);

        });

    });

    describe('On new using "new RouteCanister()"', function () {

        beforeEach(function () {

            this.routeCanister = new RouteCanister(this.mockMethod, this.mockSpecification, this.mockRouteManager, this.mockRouteMiddlewareManager, this.mockRouteHandlerManager);

        });

        it('Should have its method set', function () {

            expect(this.routeCanister.getMethod()).to.equal(this.mockMethod);

        });

        it('Should have its specification set', function () {

            expect(this.routeCanister.getSpecification()).to.equal(this.mockSpecification);

        });

        it('Should have its route manager set', function () {

            expect(this.routeCanister._routeManager).to.deep.equal(this.mockRouteManager);

        });

        it('Should have its route middleware manager set', function () {

            expect(this.routeCanister._routeMiddlewareManager).to.deep.equal(this.mockRouteMiddlewareManager);

        });

        it('Should have its route handler manager set', function () {

            expect(this.routeCanister._routeHandlerManager).to.deep.equal(this.mockRouteHandlerManager);

        });

        describe('Specifying a single middleware', function () {

            beforeEach(function () {

                delete this.result;
                this.result = this.routeCanister.middleware(this.mockMiddlewareA);

            });

            it('Should add the middleware for the route to the route middleware manager', function () {

                expect(this.mockRouteMiddlewareManager.addMiddlewareForRoute.callCount).to.equal(1);
                expect(this.mockRouteMiddlewareManager.addMiddlewareForRoute.getCall(0).args).to.deep.equal(['put', '/test/specification', this.mockMiddlewareA]);

            });

            it('Should return the route canister', function () {

                expect(this.result).to.deep.equal(this.routeCanister);

            });

        });

        describe('Specifying multiple middleware', function () {

            beforeEach(function () {

                delete this.result;
                this.result = this.routeCanister.middleware(this.mockMiddlewareA, this.mockMiddlewareB);

            });

            it('Should add the middleware for the route to the route middleware manager', function () {

                expect(this.mockRouteMiddlewareManager.addMiddlewareForRoute.callCount).to.equal(2);
                expect(this.mockRouteMiddlewareManager.addMiddlewareForRoute.getCall(0).args).to.deep.equal(['put', '/test/specification', this.mockMiddlewareA]);
                expect(this.mockRouteMiddlewareManager.addMiddlewareForRoute.getCall(1).args).to.deep.equal(['put', '/test/specification', this.mockMiddlewareB]);

            });

            it('Should return the route canister', function () {

                expect(this.result).to.deep.equal(this.routeCanister);

            });

            describe('Chaining another middleware addition', function () {

                beforeEach(function () {

                    this.spies.routeMiddlewareManagerAddMiddlewareForRoute.reset();
                    delete this.result;
                    this.result = this.routeCanister.middleware(this.mockMiddlewareC);

                });

                it('Should add the middleware for the route to the route middleware manager', function () {

                    expect(this.mockRouteMiddlewareManager.addMiddlewareForRoute.callCount).to.equal(1);
                    expect(this.mockRouteMiddlewareManager.addMiddlewareForRoute.getCall(0).args).to.deep.equal(['put', '/test/specification', this.mockMiddlewareC]);

                });

                it('Should return the route canister', function () {

                    expect(this.result).to.deep.equal(this.routeCanister);

                });

            });

        });

        describe('Specifying a handler', function () {

            beforeEach(function () {

                delete this.result;
                this.result = this.routeCanister.handler(this.mockHandler);

            });

            it('Should add the route to the route manager', function () {

                expect(this.mockRouteManager.addRoute.callCount).to.equal(1);
                expect(this.mockRouteManager.addRoute.getCall(0).args).to.deep.equal(['put', '/test/specification']);

            });

            it('Should add the handler for the route to the route handler manager', function () {

                expect(this.mockRouteHandlerManager.addHandlerForRoute.callCount).to.equal(1);
                expect(this.mockRouteHandlerManager.addHandlerForRoute.getCall(0).args).to.deep.equal(['put', '/test/specification', this.mockHandler]);

            });

            it('Should not return the route canister', function () {

                expect(this.result).to.equal(undefined);

            });

        });

    });

});
