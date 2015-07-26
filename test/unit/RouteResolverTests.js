var expect = require('chai').expect;
var assert = require('chai').assert;
var mockery = require('mockery');
var Stubs = require('./Helpers/Stubs');
var Assertions = require('./Helpers/Assertions');
var RouteFactory = require('../../lib/RouteFactory');
var RouteSpecificationParser = require('../../lib/RouteSpecificationParser');
var RouteRegistry = require('../../lib/registries/RouteRegistry');


describe('RouteResolver', function () {

    beforeEach(function () {

        this.mockCacheInstance = Stubs.newGuildCacheInstance();
        this.mockGuildCache = Stubs.guildCacheModule();
        this.mockGuildCache.cacheWithSize.returns(this.mockCacheInstance);

        mockery.deregisterAll();
        mockery.enable({
            warnOnReplace: false,
            useCleanCache: true
        });

        mockery.registerAllowable('../../lib/RouteResolver');
        mockery.registerAllowable('underscore');
        mockery.registerMock('guild', this.mockGuildCache);

        this.routeSpecificationParser = new RouteSpecificationParser();
        this.routeFactory = new RouteFactory(this.routeSpecificationParser);
        this.routeRegistry = new RouteRegistry();

        this.route1 = this.routeFactory.buildRoute('GET', '/pathA');
        this.route2 = this.routeFactory.buildRoute('GET', '/pathB');
        this.route3 = this.routeFactory.buildRoute('GET', '/pathA/:variable');
        this.route4 = this.routeFactory.buildRoute('GET', '/pathA/:variableA/:variableB');

        this.routeRegistry.addRoute(this.route1);
        this.routeRegistry.addRoute(this.route2);
        this.routeRegistry.addRoute(this.route3);
        this.routeRegistry.addRoute(this.route4);

        var RouteResolver = require('../../lib/RouteResolver');
        this.routeResolver = new RouteResolver(this.routeRegistry);

    });

    afterEach(function () {

        mockery.disable();

    });

    describe('On init', function () {

        it('Should not be undefined', function () {

            expect(this.routeResolver).to.not.be.undefined;

        });

        it('Should create a route cache of size 1000', function () {

            assert(this.mockGuildCache.cacheWithSize.calledOnce);
            assert(this.mockGuildCache.cacheWithSize.calledWithExactly(1000));

        });

        describe('query(method, path)', function () {

            describe('On query GET /pathA - exists as route GET /pathA', function () {

                it('Should return known route', function () {

                    expect(this.routeResolver.query('GET', '/pathA')).to.deep.equal(this.route1);

                });

            });

            describe('On query GET /pathB - exists as route GET /pathB', function () {

                it('Should return known route', function () {

                    expect(this.routeResolver.query('GET', '/pathB')).to.deep.equal(this.route2);

                });

            });

            describe('On query GET /pathA/abc123 - exists as route GET /pathA/:variable', function () {

                it('Should return known route', function () {

                    expect(this.routeResolver.query('GET', '/pathA/abc123')).to.deep.equal(this.route3);

                });

            });

            describe('On query GET /pathA/abc123/def456 - exists as route GET /pathA/:variableA/:variableB', function () {

                it('Should return known route', function () {

                    expect(this.routeResolver.query('GET', '/pathA/abc123/def456')).to.deep.equal(this.route4);

                });

            });

        });

        describe('parseParameters(route, path)', function () {

            describe('On parseParameters with matching route and path /pathA/abc123', function () {

                it('Should return correct parameters', function () {

                    expect(this.routeResolver.parseParameters(this.route3, '/pathA/abc123')).to.deep.equal({variable: 'abc123'});

                });

            });

            describe('On parseParameters with matching route and path /pathA/abc123/def456', function () {

                it('Should return correct parameters', function () {

                    expect(this.routeResolver.parseParameters(this.route4, '/pathA/abc123/def456')).to.deep.equal({
                        variableA: 'abc123',
                        variableB: 'def456'
                    });

                });

            });

            describe('On parseParameters with non-matching route and path /pathA/abc123', function () {

                it('Should return empty parameters', function () {

                    expect(this.routeResolver.parseParameters(this.route1, '/pathA/abc123')).to.deep.equal({});

                });

            });

        });

        describe('clearRouteMapCache()', function () {

            it('Should clear the route map cache', function () {

                this.routeResolver.clearRouteMapCache();
                assert(this.mockCacheInstance.reset.calledOnce);

            });

        });

    });


});
