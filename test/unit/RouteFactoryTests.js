var expect = require('chai').expect;
var assert = require('chai').assert;
var sinon = require('sinon');
var _ = require('underscore');
var RouteFactory = require('../../lib/RouteFactory');

describe('RouteFactory', function () {

    beforeEach(function () {

        this.mockRouteSpecificationParser = {
            validateSpecification: sinon.stub(),
            buildRegEx: sinon.stub().withArgs('specification').returns('regex'),
            extractVariableComponents: sinon.stub().withArgs('specification').returns('variableComponents')
        };

    });

    describe('On new', function () {

        beforeEach(function () {

            this.routeFactory = new RouteFactory(this.mockRouteSpecificationParser);

        });

        it('Should not be undefined', function () {

            expect(this.routeFactory).to.not.be.undefined;

        });

        describe('buildRoute(method, specification)', function () {

            beforeEach(function () {

                this.route = this.routeFactory.buildRoute('method', 'specification');

            });

            it('Should validate the route specification using the route specification parser', function () {

                assert(this.mockRouteSpecificationParser.validateSpecification.calledOnce);
                assert(this.mockRouteSpecificationParser.validateSpecification.calledWithExactly('specification'));

            });

            it('Should return a route', function () {

                expect(this.route).to.not.be.undefined;

            });

            it('Should return a route with the correct route method', function () {

                expect(this.route.getMethod()).to.equal('method');

            });

            it('Should return a route with the correct route specification', function () {

                expect(this.route.getSpecification()).to.equal('specification');

            });

            it('Should return a route with the regex returned by the route specification parser', function () {

                expect(this.route.getRegex()).to.equal('regex');

            });

            it('Should return a route with the variable components returned by the route specification parser', function () {

                expect(this.route.getVariableComponents()).to.equal('variableComponents');

            });

        });

    });

});
