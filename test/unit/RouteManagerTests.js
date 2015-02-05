var expect = require('chai').expect;
var assert = require('chai').assert;
var mockery = require('mockery');
var sinon = require('sinon');
var _ = require('underscore');
var Stubs = require('./Helpers/Stubs');
var Assertions = require('./Helpers/Assertions');

describe('RouteManager', function () {

    beforeEach(function () {

        this.mockCacheInstance = Stubs.newGuildCacheInstance();
        this.mockGuildCache = Stubs.guildCacheModule();
        this.mockGuildCache.cacheWithSize.returns(this.mockCacheInstance);

        mockery.deregisterAll();
        mockery.enable({
            warnOnReplace: false,
            useCleanCache: true
        });

        mockery.registerAllowable('underscore');
        mockery.registerAllowable('../../lib/RouteManager');
        mockery.registerMock('guild', this.mockGuildCache);

        var RouteManager = require('../../lib/RouteManager');
        this.routeManager = new RouteManager();

    });

    afterEach(function () {

        mockery.disable();

    });

    describe('On init', function () {

        it('Should create a route cache of size 1000', function () {

            assert(this.mockGuildCache.cacheWithSize.calledOnce);
            assert(this.mockGuildCache.cacheWithSize.calledWithExactly(1000));

        });

    });

    describe('Route specification validation when adding a route', function () {

        describe('Valid route specifications', function () {

            it('Should not throw an exception for the route /test', function () {

                Assertions.assertNoThrow(function () {
                    this.routeManager.addRoute('GET', '/test');
                }, this);

            });

            it('Should not throw an exception for the route /test_case/', function () {

                Assertions.assertNoThrow(function () {
                    this.routeManager.addRoute('GET', '/test_case/')
                }, this);

            });

            it('Should not throw an exception for the route /test-case/:var', function () {

                Assertions.assertNoThrow(function () {
                    this.routeManager.addRoute('GET', '/test-case/:var')
                }, this);

            });


            it('Should not throw an exception for the route /test/:var/example', function () {

                Assertions.assertNoThrow(function () {
                    this.routeManager.addRoute('GET', '/test/:var/example')
                }, this);

            });

            it('Should not throw an exception for the route /test/:var/:varB/example', function () {

                Assertions.assertNoThrow(function () {
                    this.routeManager.addRoute('GET', '/test/:var/:varB/example')
                }, this);

            });

            it('Should not throw an exception for the route /test/:var/:varB/example.test', function () {

                Assertions.assertNoThrow(function () {
                    this.routeManager.addRoute('GET', '/test/:var/:varB/example.test')
                }, this);

            });

            it('Should not throw an exception for the route /test.case/:var/:varB/example', function () {

                Assertions.assertNoThrow(function () {
                    this.routeManager.addRoute('GET', '/test.case/:var/:varB/example')
                }, this);

            });


            it('Should not throw an exception for the route /test/:var/static/:varB/_example', function () {

                Assertions.assertNoThrow(function () {
                    this.routeManager.addRoute('GET', '/test/:var/static/:varB/_example')
                }, this);

            });

            it('Should not throw an exception for the route /test/:var/example/*', function () {

                Assertions.assertNoThrow(function () {
                    this.routeManager.addRoute('GET', '/test/:var/example/*')
                }, this);

            });

            it('Should not throw an exception for the route /test/:var/*', function () {

                Assertions.assertNoThrow(function () {
                    this.routeManager.addRoute('GET', '/test/:var/*')
                }, this);

            });

            it('Should not throw an exception for the route /*', function () {

                Assertions.assertNoThrow(function () {
                    this.routeManager.addRoute('GET', '/*')
                }, this);

            });

            it('Should not throw an exception for the route /', function () {

                Assertions.assertNoThrow(function () {
                    this.routeManager.addRoute('GET', '/')
                }, this);

            });


        });

        describe('Invalid route specifications', function () {

            it('Should throw an exception for the route /test?', function () {

                Assertions.assertThrows(function () {
                    this.routeManager.addRoute('GET', '/test?')
                }, 'Invalid route specification', this);

            });

            it('Should throw an exception for the route /*/test/', function () {

                Assertions.assertThrows(function () {
                    this.routeManager.addRoute('GET', '/*/test/:')
                }, 'Invalid route specification', this);

            });

            it('Should throw an exception for the route //test/', function () {

                Assertions.assertThrows(function () {
                    this.routeManager.addRoute('GET', '//test/')
                }, 'Invalid route specification', this);

            });

            it('Should throw an exception for the route /test//', function () {

                Assertions.assertThrows(function () {
                    this.routeManager.addRoute('GET', '/test//')
                }, 'Invalid route specification', this);

            });

            it('Should throw an exception for the route test/', function () {

                Assertions.assertThrows(function () {
                    this.routeManager.addRoute('GET', 'test/')
                }, 'Invalid route specification', this);

            });

            it('Should throw an exception for the route test', function () {

                Assertions.assertThrows(function () {
                    this.routeManager.addRoute('GET', 'test')
                }, 'Invalid route specification', this);

            });

            it('Should throw an exception for the route /test/:var:', function () {

                Assertions.assertThrows(function () {
                    this.routeManager.addRoute('GET', '/test/:var:')
                }, 'Invalid route specification', this);

            });


            it('Should throw an exception for the route /test/*/example', function () {

                Assertions.assertThrows(function () {
                    this.routeManager.addRoute('GET', '/test/*/example')
                }, 'Invalid route specification', this);

            });

            it('Should throw an exception for the route /test/:var/example/*/route', function () {

                Assertions.assertThrows(function () {
                    this.routeManager.addRoute('GET', '/test/:var/example/*/route')
                }, 'Invalid route specification', this);

            });


            it('Should throw an exception for the route /test/:var/example*', function () {

                Assertions.assertThrows(function () {
                    this.routeManager.addRoute('GET', '/test/:var/example*')
                }, 'Invalid route specification', this);

            });

            it('Should throw an exception for the route /test/:var/:example*', function () {

                Assertions.assertThrows(function () {
                    this.routeManager.addRoute('GET', '/test/:var/:example*')
                }, 'Invalid route specification', this);

            });

            it('Should throw an exception for the route /test/:var/example*/', function () {

                Assertions.assertThrows(function () {
                    this.routeManager.addRoute('GET', '/test/:var/example*/')
                }, 'Invalid route specification', this);

            });

            it('Should throw an exception for the route /test/:var/example*/*', function () {

                Assertions.assertThrows(function () {
                    this.routeManager.addRoute('GET', '/test/:var/example*/*')
                }, 'Invalid route specification', this);

            });

            it('Should throw an exception for the route /test/:var/example/**', function () {

                Assertions.assertThrows(function () {
                    this.routeManager.addRoute('GET', '/test/:var/example/**')
                }, 'Invalid route specification', this);

            });

            it('Should throw an exception for the route *', function () {

                Assertions.assertThrows(function () {
                    this.routeManager.addRoute('GET', '*')
                }, 'Invalid route specification', this);

            });

        });

    });

    describe('When adding a basic route specification for GET requests - /someRoute.json', function () {

        beforeEach(function () {

            this.routeManager.addRoute('GET', '/someRoute.json');

        });

        it('Should add a route with the given http method - GET', function () {

            expect(this.routeManager.routes.length).to.equal(1);
            expect(this.routeManager.routes[0].method).to.equal('get');

        });

        it('Should add a route with the given specification /someRoute', function () {

            expect(this.routeManager.routes[0].specification).to.equal('/someRoute.json');


        });

    });

    describe('When adding a basic route specification for POST requests - /someRoute', function () {

        beforeEach(function () {

            this.routeManager.addRoute('POST', '/someRoute');

        });

        it('Should add a route with the given http method - POST', function () {

            expect(this.routeManager.routes.length).to.equal(1);
            expect(this.routeManager.routes[0].method).to.equal('post');

        });

    });

    describe('When adding a basic route specification for PUT requests - /someRoute', function () {

        beforeEach(function () {

            this.routeManager.addRoute('PUT', '/someRoute');

        });

        it('Should add a route with the given http method - PUT', function () {

            expect(this.routeManager.routes.length).to.equal(1);
            expect(this.routeManager.routes[0].method).to.equal('put');

        });

    });

    describe('When adding a basic route specification for DELETE requests - /someRoute', function () {

        beforeEach(function () {

            this.routeManager.addRoute('DELETE', '/someRoute');

        });

        it('Should add a route with the given http method - DELETE', function () {

            expect(this.routeManager.routes.length).to.equal(1);
            expect(this.routeManager.routes[0].method).to.equal('delete');

        });

    });


    describe('When adding a basic route specification for OTHER requests (non-standard method) - /someRoute', function () {

        beforeEach(function () {

            this.routeManager.addRoute('OTHER', '/someRoute');

        });

        it('Should add a route with the given http method - OTHER', function () {

            expect(this.routeManager.routes.length).to.equal(1);
            expect(this.routeManager.routes[0].method).to.equal('other');

        });

    });

    describe('When adding a basic route specification with no variable components or wildcards - /some.Route', function () {

        beforeEach(function () {

            this.routeManager.addRoute('GET', '/some.Route');

        });

        it('Should add a route to the routes collection', function () {

            expect(this.routeManager.routes.length).to.equal(1);

        });

        it('Should add a route with the given http method - GET', function () {

            expect(this.routeManager.routes[0].method).to.equal('get');

        });

        it('Should add a route with the given route specification - /someRoute', function () {

            expect(this.routeManager.routes[0].specification).to.equal('/some.Route');

        });

        it('Should add a route with a regex created from the specification, with optional trailing slash', function () {

            expect(this.routeManager.routes[0].regex.toString()).to.equal(/^\/some\.Route(?:\/)?$/.toString());

        });

        it('Should add a route that has no variable components', function () {

            expect(this.routeManager.routes[0].variableComponents).to.deep.equal([]);

        });

        describe('When a url is expected to match - GET /some.Route', function () {

            beforeEach(function () {
                this.matchedRoute = this.routeManager.query('GeT', '/some.Route');
            });

            it('Should look for the route in the cache', function () {

                assert(this.mockCacheInstance.get.calledOnce);
                expect(this.mockCacheInstance.get.calledWithExactly('get/some.Route'));

            });

            it('Should return the expected route', function () {

                expect(this.matchedRoute.specification).to.equal('/some.Route');
                expect(this.matchedRoute.method).to.equal('get');
                expect(this.matchedRoute.params).to.deep.equal({});

            });

            it('Should cache the matched route', function () {

                assert(this.mockCacheInstance.put.calledOnce);
                assert(this.mockCacheInstance.put.calledWithExactly('get/some.Route',
                    {
                        specification: '/some.Route',
                        method: 'get',
                        path: '/some.Route',
                        params: {}
                    })
                );

            });

        });

        describe('When a url is expected to match - GET /some.Route/', function () {

            beforeEach(function () {

                this.matchedRoute = this.routeManager.query('GET', '/some.Route/');

            });

            it('Should look for the route in the cache', function () {

                assert(this.mockCacheInstance.get.calledOnce);
                assert(this.mockCacheInstance.get.calledWithExactly('get/some.Route/'));

            });

            it('Should return the expected route', function () {

                expect(this.matchedRoute.specification).to.equal('/some.Route');
                expect(this.matchedRoute.method).to.equal('get');
                expect(this.matchedRoute.params).to.deep.equal({});

            });

            it('Should cache the matched route', function () {

                assert(this.mockCacheInstance.put.calledOnce);
                assert(this.mockCacheInstance.put.calledWithExactly('get/some.Route/',
                    {
                        specification: '/some.Route',
                        method: 'get',
                        path: '/some.Route/',
                        params: {}
                    })
                );

            });

        });

        describe('When a url is not expected to match - POST /some.Route', function () {

            beforeEach(function () {

                this.matchedRoute = this.routeManager.query('post', '/some.Route1');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.be.undefined;

            });

        });


        describe('When a url is not expected to match - GET /some.Route1', function () {

            beforeEach(function () {

                this.matchedRoute = this.routeManager.query('get', '/some.Route1');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.be.undefined;

            });

        });

        describe('When a url is not expected to match - GET /some.Route/test', function () {

            beforeEach(function () {

                this.matchedRoute = this.routeManager.query('GET', '/some.Route/test');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.be.undefined;

            });

        });

    });

    describe('When adding a basic route specification with a trailing slash but no variable components or wildcards - /someRoute/', function () {

        beforeEach(function () {

            this.routeManager.addRoute('GET', '/someRoute/', this.mockFinalHandler, this.mockPreHandlerA);

        });

        it('Should add a route to the routes collection', function () {

            expect(this.routeManager.routes.length).to.equal(1);

        });

        it('Should add a route with the given http method - GET', function () {

            expect(this.routeManager.routes[0].method).to.equal('get');

        });

        it('Should add a route with the given route specification - /someRoute/', function () {

            expect(this.routeManager.routes[0].specification).to.equal('/someRoute/');

        });

        it('Should add a route with a regex created from the specification, with optional trailing slash', function () {

            expect(this.routeManager.routes[0].regex.toString()).to.equal(/^\/someRoute(?:\/)?$/.toString());

        });

        it('Should add a route that has no variable components', function () {

            expect(this.routeManager.routes[0].variableComponents).to.deep.equal([]);

        });

        describe('When a url is expected to match - GET /someRoute', function () {

            beforeEach(function () {

                this.matchedRoute = this.routeManager.query('gEt', '/someRoute');

            });

            it('Should return the expected route', function () {

                expect(this.matchedRoute.specification).to.equal('/someRoute/');
                expect(this.matchedRoute.method).to.equal('get');
                expect(this.matchedRoute.params).to.deep.equal({});

            });

        });

        describe('When a url is expected to match - GET /someRoute/', function () {

            beforeEach(function () {

                this.matchedRoute = this.routeManager.query('gEt', '/someRoute/');

            });

            it('Should return the expected route', function () {

                expect(this.matchedRoute.specification).to.equal('/someRoute/');
                expect(this.matchedRoute.method).to.equal('get');
                expect(this.matchedRoute.params).to.deep.equal({});

            });

        });

        describe('When a url is not expected to match - POST /someRoute', function () {

            beforeEach(function () {

                this.matchedRoute = this.routeManager.query('POST', '/someRoute');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.be.undefined;

            });

        });

        describe('When a url is not expected to match - GET /someRoute1', function () {

            beforeEach(function () {

                this.matchedRoute = this.routeManager.query('/someRoute1');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.be.undefined;

            });

        });

        describe('When a url is not expected to match - /someRoute/1', function () {

            beforeEach(function () {

                this.matchedRoute = this.routeManager.query('/someRoute/1');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.be.undefined;

            });

        });

    });


    describe('When adding a route specification with a single variable component - /someRoute/:varA/', function () {

        beforeEach(function () {

            this.routeManager.addRoute('POST', '/someRoute/:varA/', this.mockFinalHandler, this.mockPreHandlers);

        });

        it('Should add a route to the routes collection', function () {

            expect(this.routeManager.routes.length).to.equal(1);

        });

        it('Should add a route with the given http method - POST', function () {

            expect(this.routeManager.routes[0].method).to.equal('post');

        });

        it('Should add a route with the given route specification - /someRoute/:varA/', function () {

            expect(this.routeManager.routes[0].specification).to.equal('/someRoute/:varA/');

        });

        it('Should add a route with a regex created from the specification, with optional trailing slash', function () {

            expect(this.routeManager.routes[0].regex.toString()).to.equal(/^\/someRoute\/([a-zA-Z0-9%\-_\.]+)(?:\/)?$/.toString());

        });

        it('Should add a route that has one variable component - varA', function () {

            expect(this.routeManager.routes[0].variableComponents).to.deep.equal(["varA"]);

        });

        describe('When a url is expected to match - POST /someRoute/123-abc_456', function () {

            beforeEach(function () {
                this.matchedRoute = this.routeManager.query('POST', '/someRoute/123-abc_456');
            });

            it('Should return the expected route', function () {

                expect(this.matchedRoute.specification).to.equal('/someRoute/:varA/');
                expect(this.matchedRoute.method).to.equal('post');
                expect(this.matchedRoute.params).to.deep.equal({varA: '123-abc_456'});

            });

        });

        describe('When a url is expected to match - POST /someRoute/123-abc_456/', function () {

            beforeEach(function () {
                this.matchedRoute = this.routeManager.query('POST', '/someRoute/123-abc_456/');
            });

            it('Should return the expected route', function () {

                expect(this.matchedRoute.specification).to.equal('/someRoute/:varA/');
                expect(this.matchedRoute.method).to.equal('post');
                expect(this.matchedRoute.params).to.deep.equal({varA: '123-abc_456'});

            });

        });

        describe('When a url is not expected to match - POST /someRoute/123-abc/_456/', function () {

            beforeEach(function () {

                this.matchedRoute = this.routeManager.query('POST', '/someRoute/123-abc/_456/');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.be.undefined;

            });

        });

    });

    describe('When adding a route specification with multiple variable components - /someRoute/:varA/component/:varB', function () {

        beforeEach(function () {

            this.routeManager.addRoute('POST', '/someRoute/:varA/component/:varB', this.mockFinalHandler);

        });

        it('Should add a route to the routes collection', function () {

            expect(this.routeManager.routes.length).to.equal(1);

        });

        it('Should add a route with the given http method - POST', function () {

            expect(this.routeManager.routes[0].method).to.equal('post');

        });

        it('Should add a route with the given route specification - /someRoute/:varA/component/:varB', function () {

            expect(this.routeManager.routes[0].specification).to.equal('/someRoute/:varA/component/:varB');

        });

        it('Should add a route with a regex created from the specification, with optional trailing slash', function () {

            expect(this.routeManager.routes[0].regex.toString()).to.equal(/^\/someRoute\/([a-zA-Z0-9%\-_\.]+)\/component\/([a-zA-Z0-9%\-_\.]+)(?:\/)?$/.toString());

        });

        it('Should add a route that has multiple variable components - varA and varB', function () {

            expect(this.routeManager.routes[0].variableComponents).to.deep.equal(["varA", "varB"]);

        });

        describe('When a url is expected to match - POST /someRoute/123-abc_456/component/abc_12-3', function () {

            beforeEach(function () {
                this.matchedRoute = this.routeManager.query('POST', '/someRoute/123-abc_456/component/abc_12-3');
            });

            it('Should return the expected route', function () {

                expect(this.matchedRoute.specification).to.equal('/someRoute/:varA/component/:varB');
                expect(this.matchedRoute.method).to.equal('post');
                expect(this.matchedRoute.params).to.deep.equal({
                    varA: "123-abc_456",
                    varB: "abc_12-3"
                });

            });

        });

        describe('When a url is expected to match - POST /someRoute/123-abc_456/component/abc_12-3/', function () {

            beforeEach(function () {
                this.matchedRoute = this.routeManager.query('POST', '/someRoute/123-abc_456/component/abc_12-3/');
            });

            it('Should return the expected route', function () {

                expect(this.matchedRoute.specification).to.equal('/someRoute/:varA/component/:varB');
                expect(this.matchedRoute.method).to.equal('post');
                expect(this.matchedRoute.params).to.deep.equal({
                    varA: "123-abc_456",
                    varB: "abc_12-3"
                });

            });

        });

        describe('When a url is not expected to match - GET /someRoute/123-abc_456/component/abc_12-3/', function () {

            beforeEach(function () {

                this.matchedRoute = this.routeManager.query('get', '/someRoute/123-abc_456/component/abc_12-3/');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.be.undefined;

            });

        });

        describe('When a url is not expected to match - POST /someRoute/123-ab$c_456/component/abc_12-3', function () {

            beforeEach(function () {

                this.matchedRoute = this.routeManager.query('POST', '/someRoute/12$3-abc_456/component/abc_12-3');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.be.undefined;

            });

        });

        describe('When a url is not expected to match - POST /someRoute//component/abc_12-3/', function () {

            beforeEach(function () {

                this.matchedRoute = this.routeManager.query('POST', '/someRoute//component/abc_12-3/');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.be.undefined;

            });

        });

        describe('When a url is not expected to match - POST /someRoute///component/abc_12-3/', function () {

            beforeEach(function () {

                this.matchedRoute = this.routeManager.query('POST', '/someRoute///component/abc_12-3/');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.be.undefined;

            });

        });

        describe('When a url is not expected to match - POST /someRoute/123-abc_456/component/abc_12-3/test', function () {

            beforeEach(function () {

                this.matchedRoute = this.routeManager.query('POST', '/someRoute/123-abc_456/component/abc_12-3/test');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.be.undefined;

            });

        });

    });


    describe('When adding a route specification with a trailing slash and multiple variable components - /someRoute/:varA/component/:varB/', function () {

        beforeEach(function () {

            this.routeManager.addRoute('POST', '/someRoute/:varA/component/:varB/', this.mockFinalHandler);

        });

        it('Should add a route to the routes collection', function () {

            expect(this.routeManager.routes.length).to.equal(1);

        });

        it('Should add a route with the given http method - POST', function () {

            expect(this.routeManager.routes[0].method).to.equal('post');

        });

        it('Should add a route with the given route specification - /someRoute/:varA/component/:varB/', function () {

            expect(this.routeManager.routes[0].specification).to.equal('/someRoute/:varA/component/:varB/');

        });

        it('Should add a route with a regex created from the specification, with optional trailing slash', function () {

            expect(this.routeManager.routes[0].regex.toString()).to.equal(/^\/someRoute\/([a-zA-Z0-9%\-_\.]+)\/component\/([a-zA-Z0-9%\-_\.]+)(?:\/)?$/.toString());

        });

        it('Should add a route that has multiple variable components - varA and varB', function () {

            expect(this.routeManager.routes[0].variableComponents).to.deep.equal(["varA", "varB"]);

        });

        describe('When a url is expected to match - POST /someRoute/123-abc_456/component/abc_12-3', function () {

            beforeEach(function () {
                this.matchedRoute = this.routeManager.query('POST', '/someRoute/123-abc_456/component/abc_12-3');
            });

            it('Should return the expected route', function () {

                expect(this.matchedRoute.specification).to.equal('/someRoute/:varA/component/:varB/');
                expect(this.matchedRoute.method).to.equal('post');
                expect(this.matchedRoute.params).to.deep.equal({
                    varA: "123-abc_456",
                    varB: "abc_12-3"
                });

            });

        });

        describe('When a url is expected to match - POST /someRoute/123-abc_456/component/abc_12-3/', function () {

            beforeEach(function () {
                this.matchedRoute = this.routeManager.query('POST', '/someRoute/123-abc_456/component/abc_12-3/');
            });

            it('Should return the expected route', function () {

                expect(this.matchedRoute.specification).to.equal('/someRoute/:varA/component/:varB/');
                expect(this.matchedRoute.method).to.equal('post');
                expect(this.matchedRoute.params).to.deep.equal({
                    varA: "123-abc_456",
                    varB: "abc_12-3"
                });

            });

        });

        describe('When a url is not expected to match - GET /someRoute/123-abc_456/component/abc_12-3/', function () {

            beforeEach(function () {

                this.matchedRoute = this.routeManager.query('get', '/someRoute/123-abc_456/component/abc_12-3/');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.be.undefined;

            });

        });

        describe('When a url is not expected to match - POST /someRoute/123-ab$c_456/component/abc_12-3', function () {

            beforeEach(function () {

                this.matchedRoute = this.routeManager.query('POST', '/someRoute/12$3-abc_456/component/abc_12-3');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.be.undefined;

            });

        });

        describe('When a url is not expected to match - POST /someRoute//component/abc_12-3/', function () {

            beforeEach(function () {

                this.matchedRoute = this.routeManager.query('POST', '/someRoute//component/abc_12-3/');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.be.undefined;

            });

        });

        describe('When a url is not expected to match - POST /someRoute///component/abc_12-3/', function () {

            beforeEach(function () {

                this.matchedRoute = this.routeManager.query('POST', '/someRoute///component/abc_12-3/');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.be.undefined;

            });

        });

        describe('When a url is not expected to match - POST /someRoute/123-abc_456/component/abc_12-3/test', function () {

            beforeEach(function () {

                this.matchedRoute = this.routeManager.query('POST', '/someRoute/123-abc_456/component/abc_12-3/test');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.be.undefined;

            });

        });
    });

    describe('When adding a route specification with a wildcard the end of a specification with no other variable components - /someRoute/*', function () {

        beforeEach(function () {

            this.routeManager.addRoute('PUT', '/someRoute/*', this.mockFinalHandler);

        });

        it('Should add a route to the routes collection', function () {

            expect(this.routeManager.routes.length).to.equal(1);

        });

        it('Should add a route with the given http method - PUT', function () {

            expect(this.routeManager.routes[0].method).to.equal('put');

        });

        it('Should add a route with the given route specification - /someRoute/*', function () {

            expect(this.routeManager.routes[0].specification).to.equal('/someRoute/*');

        });

        it('Should add a route with a regex created from the specification, where the slash must be present before the wildcard (even if empty), but with an optional trailing slash', function () {

            expect(this.routeManager.routes[0].regex.toString()).to.equal(/^\/someRoute\/[a-zA-Z0-9%\-_\.\/]*(?:\/)?$/.toString());

        });

        it('Should add a route that with no variable components', function () {

            expect(this.routeManager.routes[0].variableComponents).to.deep.equal([]);

        });


        describe('When a url is expected to match - PUT /someRoute/', function () {

            beforeEach(function () {

                this.matchedRoute = this.routeManager.query('PUT', '/someRoute/');

            });

            it('Should return the expected route', function () {

                expect(this.matchedRoute.specification).to.equal('/someRoute/*');
                expect(this.matchedRoute.method).to.equal('put');
                expect(this.matchedRoute.params).to.deep.equal({});

            });

        });

        describe('When a url is expected to match - PUT /someRoute/abc-123_456/test', function () {

            beforeEach(function () {

                this.matchedRoute = this.routeManager.query('PUT', '/someRoute/abc-123_456/test');

            });

            it('Should return the expected route', function () {

                expect(this.matchedRoute.specification).to.equal('/someRoute/*');
                expect(this.matchedRoute.method).to.equal('put');
                expect(this.matchedRoute.params).to.deep.equal({});

            });

        });

        describe('When a url is not expected to match - PUT /someRoute', function () {

            beforeEach(function () {

                this.matchedRoute = this.routeManager.query('put', '/someRoute');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.be.undefined;

            });

        });

        describe('When a url is not expected to match - POST /someRoute/', function () {

            beforeEach(function () {

                this.matchedRoute = this.routeManager.query('post', '/someRoute');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.be.undefined;

            });

        });

    });

    describe('When adding a route specification with a wildcard the end of a specification with variable components - /someRoute/:varA/:varB/*', function () {

        beforeEach(function () {

            this.routeManager.addRoute('GET', '/someRoute/:varA/:varB/*', this.mockFinalHandler);

        });

        it('Should add a route to the routes collection', function () {

            expect(this.routeManager.routes.length).to.equal(1);

        });

        it('Should add a route with the given http method - GET', function () {

            expect(this.routeManager.routes[0].method).to.equal('get');

        });

        it('Should add a route with the given route specification - /someRoute/:varA/:varB/*', function () {

            expect(this.routeManager.routes[0].specification).to.equal('/someRoute/:varA/:varB/*');

        });

        it('Should add a route with a regex created from the specification, where the slash must be present before the wildcard (even if empty), but with an optional trailing slash', function () {

            expect(this.routeManager.routes[0].regex.toString()).to.equal(/^\/someRoute\/([a-zA-Z0-9%\-_\.]+)\/([a-zA-Z0-9%\-_\.]+)\/[a-zA-Z0-9%\-_\.\/]*(?:\/)?$/.toString());

        });

        it('Should add a route that with the correct number of variable components - varA and varB', function () {

            expect(this.routeManager.routes[0].variableComponents).to.deep.equal(['varA', 'varB']);

        });

        describe('When a url is expected to match - GET /someRoute/abc-123_456/123_456-abc/', function () {

            beforeEach(function () {

                this.matchedRoute = this.routeManager.query('get', '/someRoute/abc-123_456/123_456-abc/');

            });

            it('Should return the expected route', function () {

                expect(this.matchedRoute.specification).to.equal('/someRoute/:varA/:varB/*');
                expect(this.matchedRoute.method).to.equal('get');
                expect(this.matchedRoute.params).to.deep.equal({
                    varA: "abc-123_456",
                    varB: "123_456-abc"
                });

            });

        });

        describe('When a url is expected to match - GET /someRoute/abc-123_456/123_456-abc/abc', function () {

            beforeEach(function () {

                this.matchedRoute = this.routeManager.query('get', '/someRoute/abc-123_456/123_456-abc/abc');

            });

            it('Should return the expected route', function () {

                expect(this.matchedRoute.specification).to.equal('/someRoute/:varA/:varB/*');
                expect(this.matchedRoute.method).to.equal('get');
                expect(this.matchedRoute.params).to.deep.equal({
                    varA: "abc-123_456",
                    varB: "123_456-abc"
                });

            });

        });

        describe('When a url is expected to match - GET /someRoute/abc-123_456/123_456-abc/abc/', function () {

            beforeEach(function () {

                this.matchedRoute = this.routeManager.query('get', '/someRoute/abc-123_456/123_456-abc/abc/');

            });

            it('Should return the expected route', function () {

                expect(this.matchedRoute.specification).to.equal('/someRoute/:varA/:varB/*');
                expect(this.matchedRoute.method).to.equal('get');
                expect(this.matchedRoute.params).to.deep.equal({
                    varA: "abc-123_456",
                    varB: "123_456-abc"
                });

            });

        });

        describe('When a url is not expected to match - GET /someRoute/abc-123_456/123_456-abc', function () {

            beforeEach(function () {

                this.matchedRoute = this.routeManager.query('get', '/someRoute/abc-123_456/123_456-abc');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.be.undefined;

            });

        });

        describe('When a url is not expected to match - GET /someRoute/abc-123_456/', function () {

            beforeEach(function () {

                this.matchedRoute = this.routeManager.query('get', '/someRoute/abc-123_456/');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.be.undefined;

            });

        });

        describe('When a url is not expected to match - GET /someRoute/abc-123_456//test', function () {

            beforeEach(function () {

                this.matchedRoute = this.routeManager.query('get', '/someRoute/abc-123_456//test');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.be.undefined;

            });

        });

        describe('When a url is not expected to match - GET /someRoute//123_456-abc/test/case', function () {

            beforeEach(function () {

                this.matchedRoute = this.routeManager.query('get', '/someRoute//123_456-abc/test/case');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.be.undefined;

            });

        });

    });


    describe('When requesting multiple paths', function () {

        beforeEach(function () {

            this.routeManager.addRoute('GET', '/some.Route1');
            this.routeManager.addRoute('PUT', '/some.Route1');
            this.routeManager.addRoute('GET', '/some.Route2');
            this.routeManager.addRoute('GET', '/some.Route3');

            this.routeManager.query('get', '/some.Route-DoesNotExist1');
            this.routeManager.query('get', '/some.Route1');
            this.routeManager.query('put', '/some.Route1');
            this.routeManager.query('get', '/some.Route2');
            this.routeManager.query('get', '/some.Route3');

        });

        it('Should cache path/routes that exist, but not those that don\'t', function () {

            expect(this.mockCacheInstance.put.callCount).to.equal(4);
            expect(this.mockCacheInstance.put.getCall(0).args[0]).to.deep.equal('get/some.Route1');
            expect(this.mockCacheInstance.put.getCall(1).args[0]).to.deep.equal('put/some.Route1');
            expect(this.mockCacheInstance.put.getCall(2).args[0]).to.deep.equal('get/some.Route2');
            expect(this.mockCacheInstance.put.getCall(3).args[0]).to.deep.equal('get/some.Route3');

        });

        it('Should return the correct routes when queried with valid paths (case sensitive) and valid methods (case insensitive)', function () {

            expect(this.routeManager.query('get', '/some.Route-DoesNotExist1')).to.be.undefined;
            expect(this.routeManager.query('get', '/soMe.Route1')).to.be.undefined;
            expect(this.routeManager.query('get', '/soME.Route2')).to.be.undefined;

            expect(this.routeManager.query('gEt', '/some.Route1')).to.deep.equal({ specification: '/some.Route1',
                method: 'get',
                path: '/some.Route1',
                params: {}
            });

            expect(this.routeManager.query('puT', '/some.Route1')).to.deep.equal({ specification: '/some.Route1',
                method: 'put',
                path: '/some.Route1',
                params: {}
            });

            expect(this.routeManager.query('gEt', '/some.Route2')).to.deep.equal({ specification: '/some.Route2',
                method: 'get',
                path: '/some.Route2',
                params: {}
            });

            expect(this.routeManager.query('gET', '/some.Route3')).to.deep.equal({ specification: '/some.Route3',
                method: 'get',
                path: '/some.Route3',
                params: {}
            });

        });

        describe('Adding a new route', function () {

            beforeEach(function () {

                this.mockCacheInstance.reset.reset();
                this.routeManager.addRoute('GET', '/some.Route5');

            });

            it('Should reset the route cache', function () {

                expect(this.mockCacheInstance.reset.callCount).to.equal(1);

            });

        });

        describe('Case sensitivity', function () {

            beforeEach(function () {

                this.routeManager.addRoute('GET', '/some.Route');

            });

            describe('When querying a path using the correct method but different case that originally defined', function () {

                it('Should return the route', function () {

                    expect(this.routeManager.query('gEt', '/some.Route').specification).to.equal('/some.Route');
                    expect(this.routeManager.query('gEt', '/some.Route').method).to.equal('get');

                });

            });

            describe('When querying a path using the correct path but different casing than the specification', function () {

                it('Should not return the route', function () {

                    expect(this.routeManager.query('GET', '/soMe.Route')).to.be.undefined;

                });

            });

        });


    });

    describe('On reset()', function () {

        beforeEach(function () {

            this.routeManager.addRoute('GET', '/some.Route');
            this.routeManager.addRoute('POST', '/some.Route');
            this.routeManager.addRoute('PUT', '/some.Put.Route');

            expect(this.routeManager.routes.length).to.equal(3);

            this.mockCacheInstance.reset.reset();

            this.routeManager.reset();

        });

        it('Should remove all route definitions', function () {

            expect(this.routeManager.routes.length).to.equal(0);

        });

        it('Should reset the route cache', function () {

            expect(this.mockCacheInstance.reset.callCount).to.equal(1);

        });

    });

});
