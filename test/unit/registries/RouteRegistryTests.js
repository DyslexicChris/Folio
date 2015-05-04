var expect = require('chai').expect;
var sinon = require('sinon');
var _ = require('underscore');
var Route = require('../../../lib/Route');
var RouteRegistry = require('../../../lib/registries/RouteRegistry');

describe('RouteRegistry', function () {

    describe('On new', function () {

        beforeEach(function () {

            this.routeA = new Route();
            this.routeB = new Route();
            this.routeC = new Route();

            this.routeA.setSpecification('/testA');
            this.routeB.setSpecification('/testB');
            this.routeC.setSpecification('/testC');

            this.routeRegistry = new RouteRegistry();

        });

        it('Should not be undefined', function () {

            expect(this.routeRegistry).to.not.be.undefined;

        });

        describe('routes() before any routes have been added', function () {

            it('Should return an empty array', function () {

                expect(this.routeRegistry.routes()).to.deep.equal([]);

            });

        });

        describe('addRoute(route) for a single route', function () {

            beforeEach(function () {


                this.routeRegistry.addRoute(this.routeA);

            });

            it('Should return route when routes() is called', function () {

                expect(this.routeRegistry.routes()).to.deep.equal([this.routeA]);

            });

        });

        describe('addRoute(route) called multiple times for different routes', function () {

            beforeEach(function () {


                this.routeRegistry.addRoute(this.routeA);
                this.routeRegistry.addRoute(this.routeB);
                this.routeRegistry.addRoute(this.routeC);

            });

            it('Should return the routes when routes() is called', function () {

                expect(this.routeRegistry.routes()).to.deep.equal([this.routeA, this.routeB, this.routeC]);

            });

        });

        describe('addRoute(route) called multiple times for the same route', function () {

            beforeEach(function () {

                this.routeRegistry.addRoute(this.routeA);
                this.routeRegistry.addRoute(this.routeA);
                this.routeRegistry.addRoute(this.routeA);

            });

            it('Should return the single route when routes() is called - no duplicates', function () {

                expect(this.routeRegistry.routes()).to.deep.equal([this.routeA]);

            });

        });

        describe('reset() after routes have been added', function () {

            beforeEach(function () {

                this.routeRegistry.addRoute(this.routeA);
                this.routeRegistry.addRoute(this.routeB);
                this.routeRegistry.addRoute(this.routeC);

                expect(this.routeRegistry.routes()).to.deep.equal([this.routeA, this.routeB, this.routeC]);

                this.routeRegistry.reset();

            });

            it('routes() should return an empty array', function () {

                expect(this.routeRegistry.routes()).to.deep.equal([]);

            });

        });

    });

});
