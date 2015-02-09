var expect = require('chai').expect;
var assert = require('chai').assert;
var Stubs = require('./Helpers/Stubs');
var Assertions = require('./Helpers/Assertions');
var RouteHandlerManager = require('../../lib/RouteHandlerManager');

describe('RouteHandlerManager', function () {

    beforeEach(function () {

        this.routeHandlerManager = new RouteHandlerManager();

        this.mockRouteA = {
            method: 'get',
            specification: '/testA'
        };

        this.mockRouteB = {
            method: 'post',
            specification: '/testB'
        };

        this.mockRouteC = {
            method: 'post',
            specification: '/testC'
        };

        this.validHandlerA = Stubs.newFunction();
        this.validHandlerB = Stubs.newFunction();
        this.invalidHandler = {};

    });

    describe('When adding a handler for a route', function () {

        describe('A valid handler', function () {

            it('Should not throw an exception', function () {

                Assertions.assertNoThrow(function () {
                    this.routeHandlerManager.addHandlerForRoute(this.mockRouteA.method, this.mockRouteA.specification, this.validHandlerA);
                }, this);

            });

            it('Should return the handler when asked', function () {

                this.routeHandlerManager.addHandlerForRoute(this.mockRouteA.method, this.mockRouteA.specification, this.validHandlerA);
                expect(this.routeHandlerManager.getHandlerForRoute(this.mockRouteA.method, this.mockRouteA.specification)).to.equal(this.validHandlerA);

            });

            it('Should return the handler when asked - method should be case insensitive', function () {

                this.routeHandlerManager.addHandlerForRoute(this.mockRouteA.method, this.mockRouteA.specification, this.validHandlerA);
                expect(this.routeHandlerManager.getHandlerForRoute('geT', this.mockRouteA.specification)).to.equal(this.validHandlerA);

            });

            it('Should not return a handler if the path casing does not match the specification\'s', function () {

                this.routeHandlerManager.addHandlerForRoute(this.mockRouteA.method, this.mockRouteA.specification, this.validHandlerA);
                expect(this.routeHandlerManager.getHandlerForRoute('get', '/testa')).to.be.undefined;

            });

        });

        describe('Multiple handlers', function () {

            beforeEach(function () {

                this.routeHandlerManager.addHandlerForRoute(this.mockRouteA.method, this.mockRouteA.specification, this.validHandlerA);
                this.routeHandlerManager.addHandlerForRoute(this.mockRouteB.method, this.mockRouteB.specification, this.validHandlerB);

            });

            it('Should return the correct handler when asked', function () {

                expect(this.routeHandlerManager.getHandlerForRoute(this.mockRouteA.method, this.mockRouteA.specification)).to.equal(this.validHandlerA);
                expect(this.routeHandlerManager.getHandlerForRoute(this.mockRouteB.method, this.mockRouteB.specification)).to.equal(this.validHandlerB);

            });

        });

        describe('An invalid handler', function () {

            it('Should throw an exception', function () {

                Assertions.assertThrows(function () {
                    this.routeHandlerManager.addHandlerForRoute(this.mockRouteA.method, this.mockRouteA.specification, this.invalidHandler)
                }, 'Handler is not a function', this);

            });

        });

    });

    describe('When asking to handle a route that has no handler', function () {

        it('Should be undefined', function () {

            expect(this.routeHandlerManager.getHandlerForRoute(this.mockRouteC.method, this.mockRouteC.specification)).to.be.undefined;

        });

    });

    describe('On reset()', function () {

        beforeEach(function () {

            this.routeHandlerManager.addHandlerForRoute(this.mockRouteA.method, this.mockRouteA.specification, this.validHandlerA);
            this.routeHandlerManager.addHandlerForRoute(this.mockRouteB.method, this.mockRouteB.specification, this.validHandlerB);

            expect(this.routeHandlerManager.getHandlerForRoute(this.mockRouteA.method, this.mockRouteA.specification)).to.equal(this.validHandlerA);
            expect(this.routeHandlerManager.getHandlerForRoute(this.mockRouteB.method, this.mockRouteB.specification)).to.equal(this.validHandlerB);

            this.routeHandlerManager.reset();

        });

        it('Should remove all route handlers', function () {

            expect(this.routeHandlerManager.getHandlerForRoute(this.mockRouteA.method, this.mockRouteA.specification)).to.be.undefined;
            expect(this.routeHandlerManager.getHandlerForRoute(this.mockRouteB.method, this.mockRouteB.specification)).to.be.undefined;

        });

    });

});
