var expect = require('chai').expect;
var RouteHandlerManager = require('../lib/RouteHandlerManager');

describe('RouteHandlerManager', function () {

    beforeEach(function () {

        this.routeHandlerManager = new RouteHandlerManager();

        this.mockRouteA = {
            specification: '/testA'
        };

        this.mockRouteB = {
            specification: '/testB'
        };

        this.validHandlerA = function () {
        };

        this.validHandlerB = function () {
        };

        this.invalidHandler = {};

    });

    describe('When adding a handler for a route', function () {

        describe('A valid handler', function () {

            it('Should not throw an exception', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.routeHandlerManager.addHandlerForRoute(thisTest.mockRouteA, thisTest.validHandlerA)
                }).to.not.throw();

            });

            it('Should return the handler when asked', function () {

                this.routeHandlerManager.addHandlerForRoute(this.mockRouteA, this.validHandlerA);
                expect(this.routeHandlerManager.getHandlerForRoute(this.mockRouteA)).to.equal(this.validHandlerA);

            });

        });

        describe('Multiple handlers', function () {

            beforeEach(function () {

                this.routeHandlerManager.addHandlerForRoute(this.mockRouteA, this.validHandlerA);
                this.routeHandlerManager.addHandlerForRoute(this.mockRouteB, this.validHandlerB);

            });

            it('Should return the correct handler when asked', function () {

                expect(this.routeHandlerManager.getHandlerForRoute(this.mockRouteA)).to.equal(this.validHandlerA);
                expect(this.routeHandlerManager.getHandlerForRoute(this.mockRouteB)).to.equal(this.validHandlerB);

            });

        });

        describe('An invalid handler', function () {

            it('Should throw an exception', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.routeHandlerManager.addHandlerForRoute(thisTest.mockRouteA, thisTest.invalidHandler)
                }).to.throw('Handler is not a function');

            });

        });

    });

});
