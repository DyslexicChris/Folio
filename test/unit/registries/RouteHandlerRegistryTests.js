var expect = require('chai').expect;
var assert = require('chai').assert;
var Stubs = require('./../Helpers/Stubs');
var Assertions = require('./../Helpers/Assertions');
var RouteHandlerRegistry = require('../../../lib/registries/RouteHandlerRegistry');
var Route = require('../../../lib/Route');

describe('RouteHandlerRegistry', function () {

    beforeEach(function () {

        this.routeHandlerRegistry = new RouteHandlerRegistry();

        this.mockRouteA = new Route();
        this.mockRouteA.setMethod('GET');
        this.mockRouteA.setSpecification('/mockRouteA');

        this.mockRouteB = new Route();
        this.mockRouteB.setMethod('GET');
        this.mockRouteB.setSpecification('/mockRouteB');

        this.mockRouteC = new Route();
        this.mockRouteC.setMethod('GET');
        this.mockRouteC.setSpecification('/mockRouteC');

        this.validHandlerA = Stubs.newFunction();
        this.validHandlerB = Stubs.newFunction();
        this.invalidHandler = {};

    });

    describe('When adding a handler for a route', function () {

        describe('A valid handler', function () {

            it('Should not throw an exception', function () {

                Assertions.assertNoThrow(function () {
                    this.routeHandlerRegistry.addHandlerForRoute(this.mockRouteA, this.validHandlerA);
                }, this);

            });

            it('Should return the handler when asked', function () {

                this.routeHandlerRegistry.addHandlerForRoute(this.mockRouteA, this.validHandlerA);
                expect(this.routeHandlerRegistry.getHandlerForRoute(this.mockRouteA)).to.equal(this.validHandlerA);

            });

        });

        describe('Multiple handlers', function () {

            beforeEach(function () {

                this.routeHandlerRegistry.addHandlerForRoute(this.mockRouteA, this.validHandlerA);
                this.routeHandlerRegistry.addHandlerForRoute(this.mockRouteB, this.validHandlerB);

            });

            it('Should return the correct handler when asked', function () {

                expect(this.routeHandlerRegistry.getHandlerForRoute(this.mockRouteA)).to.equal(this.validHandlerA);
                expect(this.routeHandlerRegistry.getHandlerForRoute(this.mockRouteB)).to.equal(this.validHandlerB);

            });

        });

        describe('An invalid handler', function () {

            it('Should throw an exception', function () {

                Assertions.assertThrows(function () {
                    this.routeHandlerRegistry.addHandlerForRoute(this.mockRouteA, this.invalidHandler)
                }, 'Handler is not a function', this);

            });

        });

    });

    describe('When asking to handle a route that has no handler', function () {

        it('Should be undefined', function () {

            expect(this.routeHandlerRegistry.getHandlerForRoute(this.mockRouteC)).to.be.undefined;

        });

    });

    describe('On reset()', function () {

        beforeEach(function () {

            this.routeHandlerRegistry.addHandlerForRoute(this.mockRouteA, this.validHandlerA);
            this.routeHandlerRegistry.addHandlerForRoute(this.mockRouteB, this.validHandlerB);

            expect(this.routeHandlerRegistry.getHandlerForRoute(this.mockRouteA)).to.equal(this.validHandlerA);
            expect(this.routeHandlerRegistry.getHandlerForRoute(this.mockRouteB)).to.equal(this.validHandlerB);

            this.routeHandlerRegistry.reset();

        });

        it('Should remove all route handlers', function () {

            expect(this.routeHandlerRegistry.getHandlerForRoute(this.mockRouteA)).to.be.undefined;
            expect(this.routeHandlerRegistry.getHandlerForRoute(this.mockRouteB)).to.be.undefined;

        });

    });

});
