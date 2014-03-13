var expect = require('chai').expect;
var Router = require('../lib/Router');

describe('Router', function () {
    'use strict';


    beforeEach(function () {

        this.router = new Router();

        this.mockFinalHandler = function () {
        };

        this.mockPreHandlerA = function () {
        };

        this.mockPreHandlerB = function () {
        };

        this.mockPreHandlers = [this.mockPreHandlerA, this.mockPreHandlerB];

    });

    describe('Route specification validation when adding a route', function () {

        describe('Valid route specifications', function () {

            it('Should not throw an exception for the route /test', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.router.addRoute('GET', '/test', thisTest.mockFinalHandler)
                }).to.not.throw('Invalid route specification');

            });

            it('Should not throw an exception for the route /test_case/', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.router.addRoute('GET', '/test_case/', thisTest.mockFinalHandler)
                }).to.not.throw('Invalid route specification');

            });

            it('Should not throw an exception for the route /test-case/:var', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.router.addRoute('GET', '/test-case/:var', thisTest.mockFinalHandler)
                }).to.not.throw('Invalid route specification');

            });


            it('Should not throw an exception for the route /test/:var/example', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.router.addRoute('GET', '/test/:var/example', thisTest.mockFinalHandler)
                }).to.not.throw('Invalid route specification');

            });

            it('Should not throw an exception for the route /test/:var/:varB/example', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.router.addRoute('GET', '/test/:var/:varB/example', thisTest.mockFinalHandler)
                }).to.not.throw('Invalid route specification');

            });

            it('Should not throw an exception for the route /test/:var/:varB/example.test', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.router.addRoute('GET', '/test/:var/:varB/example.test', thisTest.mockFinalHandler)
                }).to.not.throw('Invalid route specification');

            });

            it('Should not throw an exception for the route /test.case/:var/:varB/example', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.router.addRoute('GET', '/test.case/:var/:varB/example', thisTest.mockFinalHandler)
                }).to.not.throw('Invalid route specification');

            });


            it('Should not throw an exception for the route /test/:var/static/:varB/_example', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.router.addRoute('GET', '/test/:var/static/:varB/_example', thisTest.mockFinalHandler)
                }).to.not.throw('Invalid route specification');

            });

            it('Should not throw an exception for the route /test/:var/example/*', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.router.addRoute('GET', '/test/:var/example/*', thisTest.mockFinalHandler)
                }).to.not.throw('Invalid route specification');

            });

            it('Should not throw an exception for the route /test/:var/*', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.router.addRoute('GET', '/test/:var/*', thisTest.mockFinalHandler)
                }).to.not.throw('Invalid route specification');

            });

            it('Should not throw an exception for the route /*', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.router.addRoute('GET', '/*', thisTest.mockFinalHandler)
                }).to.not.throw('Invalid route specification');

            });

            it('Should not throw an exception for the route /', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.router.addRoute('GET', '/', thisTest.mockFinalHandler)
                }).to.not.throw('Invalid route specification');

            });


        });

        describe('Invalid route specifications', function () {

            it('Should throw an exception for the route /test?', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.router.addRoute('GET', '/test?', thisTest.mockFinalHandler)
                }).to.throw('Invalid route specification');

            });

            it('Should throw an exception for the route /*/test/', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.router.addRoute('GET', '/*/test/:', thisTest.mockFinalHandler)
                }).to.throw('Invalid route specification');

            });

            it('Should throw an exception for the route //test/', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.router.addRoute('GET', '//test/', thisTest.mockFinalHandler)
                }).to.throw('Invalid route specification');

            });

            it('Should throw an exception for the route /test//', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.router.addRoute('GET', '/test//', thisTest.mockFinalHandler)
                }).to.throw('Invalid route specification');

            });

            it('Should throw an exception for the route test/', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.router.addRoute('GET', 'test/', thisTest.mockFinalHandler)
                }).to.throw('Invalid route specification');

            });

            it('Should throw an exception for the route test', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.router.addRoute('GET', 'test', thisTest.mockFinalHandler)
                }).to.throw('Invalid route specification');

            });

            it('Should throw an exception for the route /test/:var:', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.router.addRoute('GET', '/test/:var:', thisTest.mockFinalHandler)
                }).to.throw('Invalid route specification');

            });


            it('Should throw an exception for the route /test/*/example', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.router.addRoute('GET', '/test/*/example', thisTest.mockFinalHandler)
                }).to.throw('Invalid route specification');

            });

            it('Should throw an exception for the route /test/:var/example/*/route', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.router.addRoute('GET', '/test/:var/example/*/route', thisTest.mockFinalHandler)
                }).to.throw('Invalid route specification');

            });


            it('Should throw an exception for the route /test/:var/example*', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.router.addRoute('GET', '/test/:var/example*', thisTest.mockFinalHandler)
                }).to.throw('Invalid route specification');

            });

            it('Should throw an exception for the route /test/:var/:example*', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.router.addRoute('GET', '/test/:var/:example*', thisTest.mockFinalHandler)
                }).to.throw('Invalid route specification');

            });

            it('Should throw an exception for the route /test/:var/example*/', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.router.addRoute('GET', '/test/:var/example*/', thisTest.mockFinalHandler)
                }).to.throw('Invalid route specification');

            });

            it('Should throw an exception for the route /test/:var/example*/*', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.router.addRoute('GET', '/test/:var/example*/*', thisTest.mockFinalHandler)
                }).to.throw('Invalid route specification');

            });

            it('Should throw an exception for the route /test/:var/example/**', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.router.addRoute('GET', '/test/:var/example/**', thisTest.mockFinalHandler)
                }).to.throw('Invalid route specification');

            });

            it('Should throw an exception for the route *', function () {

                var thisTest = this;

                expect(function () {
                    thisTest.router.addRoute('GET', '*', thisTest.mockFinalHandler)
                }).to.throw('Invalid route specification');

            });

        });

    });

    describe('When adding a basic route specification for GET requests without prehandlers', function () {

        beforeEach(function () {

            this.router.addRoute('GET', '/someRoute', this.mockFinalHandler);

        });

        it('Should add a route with the given http method - GET', function () {

            expect(this.router.routes.length).to.equal(1);
            expect(this.router.routes[0].method).to.equal('get');

        });

        it('Should add a route with the given specification /someRoute', function () {

            expect(this.router.routes[0].routeSpec).to.equal('/someRoute');


        });

        it('Should add a route with no prehandlers', function () {

            expect(this.router.routes[0].preHandlers).to.deep.equal([]);

        });

        it('Should add a route with the correct final handler', function () {

            expect(this.router.routes[0].finalHandler).to.deep.equal(this.mockFinalHandler);

        });

    });

    describe('When adding a basic route specification for GET requests with a single prehandler', function () {

        beforeEach(function () {

            this.router.addRoute('GET', '/someRoute.json', this.mockFinalHandler, this.mockPreHandlerA);

        });

        it('Should add a route with the given http method - GET', function () {

            expect(this.router.routes.length).to.equal(1);
            expect(this.router.routes[0].method).to.equal('get');

        });

        it('Should add a route with the given specification /someRoute.json', function () {

            expect(this.router.routes[0].routeSpec).to.equal('/someRoute.json');

        });

        it('Should add a route with the correct prehandler', function () {

            expect(this.router.routes[0].preHandlers).to.deep.equal([this.mockPreHandlerA]);

        });

        it('Should add a route with the correct final handler', function () {

            expect(this.router.routes[0].finalHandler).to.deep.equal(this.mockFinalHandler);

        });

    });

    describe('When adding a basic route specification for GET requests with multiple prehandlers', function () {

        beforeEach(function () {

            this.router.addRoute('GET', '/someRoute', this.mockFinalHandler, this.mockPreHandlers);

        });

        it('Should add a route with the given http method - GET', function () {

            expect(this.router.routes.length).to.equal(1);
            expect(this.router.routes[0].method).to.equal('get');

        });

        it('Should add a route with the given specification /someRoute', function () {

            expect(this.router.routes[0].routeSpec).to.equal('/someRoute');

        });

        it('Should add a route with the correct prehandlers', function () {

            expect(this.router.routes[0].preHandlers).to.deep.equal(this.mockPreHandlers);

        });

        it('Should add a route with the correct final handler', function () {

            expect(this.router.routes[0].finalHandler).to.deep.equal(this.mockFinalHandler);

        });

    });

    describe('When adding a basic route specification for POST requests', function () {

        beforeEach(function () {

            this.router.addRoute('POST', '/someRoute', this.mockFinalHandler);

        });

        it('Should add a route with the given http method - POST', function () {

            expect(this.router.routes.length).to.equal(1);
            expect(this.router.routes[0].method).to.equal('post');

        });

    });

    describe('When adding a basic route specification for PUT requests', function () {

        beforeEach(function () {

            this.router.addRoute('PUT', '/someRoute', this.mockFinalHandler);

        });

        it('Should add a route with the given http method - PUT', function () {

            expect(this.router.routes.length).to.equal(1);
            expect(this.router.routes[0].method).to.equal('put');

        });

    });

    describe('When adding a basic route specification for DELETE requests', function () {

        beforeEach(function () {

            this.router.addRoute('DELETE', '/someRoute', this.mockFinalHandler);

        });

        it('Should add a route with the given http method - DELETE', function () {

            expect(this.router.routes.length).to.equal(1);
            expect(this.router.routes[0].method).to.equal('delete');

        });

    });


    describe('When adding a basic route specification for OTHER requests (non-standard method)', function () {

        beforeEach(function () {

            this.router.addRoute('OTHER', '/someRoute', this.mockFinalHandler);

        });

        it('Should add a route with the given http method - OTHER', function () {

            expect(this.router.routes.length).to.equal(1);
            expect(this.router.routes[0].method).to.equal('other');

        });

    });

    describe('When adding a basic route specification with no variable components or wildcards - /some.Route', function () {

        beforeEach(function () {

            this.router.addRoute('GET', '/some.Route', this.mockFinalHandler);

        });

        it('Should add a route to the routes collection', function () {

            expect(this.router.routes.length).to.equal(1);

        });

        it('Should add a route with the given http method - GET', function () {

            expect(this.router.routes[0].method).to.equal('get');

        });

        it('Should add a route with the given route specification - /someRoute', function () {

            expect(this.router.routes[0].routeSpec).to.equal('/some.Route');

        });

        it('Should add a route with a regex created from the specification, with optional trailing slash', function () {

            expect(this.router.routes[0].regex.toString()).to.equal(/^\/some\.Route(?:\/)?$/i.toString());

        });

        it('Should add a route that has no variable components', function () {

            expect(this.router.routes[0].variableComponents).to.deep.equal([]);

        });

        describe('When a url is expected to match - GET /some.Route', function () {

            beforeEach(function () {
                this.matchedRoute = this.router.matchPath('GeT', '/some.Route');
            });

            it('Should return the expected route', function () {

                expect(this.matchedRoute.specification).to.equal('/some.Route');
                expect(this.matchedRoute.method).to.equal('get');
                expect(this.matchedRoute.params).to.deep.equal({});
                expect(this.matchedRoute.preHandlers).to.deep.equal([]);
                expect(this.matchedRoute.finalHandler).to.deep.equal(this.mockFinalHandler);

            });

        });

        describe('When a url is expected to match - GET /some.Route/', function () {

            beforeEach(function () {

                this.matchedRoute = this.router.matchPath('GET', '/some.Route/');

            });

            it('Should return the expected route', function () {

                expect(this.matchedRoute.specification).to.equal('/some.Route');
                expect(this.matchedRoute.method).to.equal('get');
                expect(this.matchedRoute.params).to.deep.equal({});
                expect(this.matchedRoute.preHandlers).to.deep.equal([]);
                expect(this.matchedRoute.finalHandler).to.deep.equal(this.mockFinalHandler);

            });

        });

        describe('When a url is not expected to match - POST /some.Route', function () {

            beforeEach(function () {

                this.matchedRoute = this.router.matchPath('post', '/some.Route1');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.equal(undefined);

            });

        });


        describe('When a url is not expected to match - GET /some.Route1', function () {

            beforeEach(function () {

                this.matchedRoute = this.router.matchPath('get', '/some.Route1');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.equal(undefined);

            });

        });

        describe('When a url is not expected to match - GET /some.Route/test', function () {

            beforeEach(function () {

                this.matchedRoute = this.router.matchPath('GET', '/some.Route/test');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.equal(undefined);

            });

        });

    });

    describe('When adding a basic route specification with a trailing slash but no variable components or wildcards - /someRoute/', function () {

        beforeEach(function () {

            this.router.addRoute('GET', '/someRoute/', this.mockFinalHandler, this.mockPreHandlerA);

        });

        it('Should add a route to the routes collection', function () {

            expect(this.router.routes.length).to.equal(1);

        });

        it('Should add a route with the given http method - GET', function () {

            expect(this.router.routes[0].method).to.equal('get');

        });

        it('Should add a route with the given route specification - /someRoute/', function () {

            expect(this.router.routes[0].routeSpec).to.equal('/someRoute/');

        });

        it('Should add a route with a regex created from the specification, with optional trailing slash', function () {

            expect(this.router.routes[0].regex.toString()).to.equal(/^\/someRoute(?:\/)?$/i.toString());

        });

        it('Should add a route that has no variable components', function () {

            expect(this.router.routes[0].variableComponents).to.deep.equal([]);

        });

        describe('When a url is expected to match - GET /someRoute', function () {

            beforeEach(function () {

                this.matchedRoute = this.router.matchPath('gEt', '/someRoute');

            });

            it('Should return the expected route', function () {

                expect(this.matchedRoute.specification).to.equal('/someRoute/');
                expect(this.matchedRoute.method).to.equal('get');
                expect(this.matchedRoute.params).to.deep.equal({});
                expect(this.matchedRoute.preHandlers.length).to.equal(1);
                expect(this.matchedRoute.preHandlers[0]).to.deep.equal(this.mockPreHandlerA);
                expect(this.matchedRoute.finalHandler).to.deep.equal(this.mockFinalHandler);

            });

        });

        describe('When a url is expected to match - GET /someRoute/', function () {

            beforeEach(function () {

                this.matchedRoute = this.router.matchPath('gEt', '/someRoute/');

            });

            it('Should return the expected route', function () {

                expect(this.matchedRoute.specification).to.equal('/someRoute/');
                expect(this.matchedRoute.method).to.equal('get');
                expect(this.matchedRoute.params).to.deep.equal({});
                expect(this.matchedRoute.preHandlers.length).to.equal(1);
                expect(this.matchedRoute.preHandlers[0]).to.deep.equal(this.mockPreHandlerA);
                expect(this.matchedRoute.finalHandler).to.deep.equal(this.mockFinalHandler);

            });

        });

        describe('When a url is not expected to match - POST /someRoute', function () {

            beforeEach(function () {

                this.matchedRoute = this.router.matchPath('POST', '/someRoute');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.equal(undefined);

            });

        });

        describe('When a url is not expected to match - GET /someRoute1', function () {

            beforeEach(function () {

                this.matchedRoute = this.router.matchPath('/someRoute1');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.equal(undefined);

            });

        });

        describe('When a url is not expected to match - /someRoute/1', function () {

            beforeEach(function () {

                this.matchedRoute = this.router.matchPath('/someRoute/1');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.equal(undefined);

            });

        });

    });


    describe('When adding a route specification with a single variable component - /someRoute/:varA/', function () {

        beforeEach(function () {

            this.router.addRoute('POST', '/someRoute/:varA/', this.mockFinalHandler, this.mockPreHandlers);

        });

        it('Should add a route to the routes collection', function () {

            expect(this.router.routes.length).to.equal(1);

        });

        it('Should add a route with the given http method - POST', function () {

            expect(this.router.routes[0].method).to.equal('post');

        });

        it('Should add a route with the given route specification - /someRoute/:varA/', function () {

            expect(this.router.routes[0].routeSpec).to.equal('/someRoute/:varA/');

        });

        it('Should add a route with a regex created from the specification, with optional trailing slash', function () {

            expect(this.router.routes[0].regex.toString()).to.equal(/^\/someRoute\/([a-z0-9%\-_\.]+)(?:\/)?$/i.toString());

        });

        it('Should add a route that has one variable component - varA', function () {

            expect(this.router.routes[0].variableComponents).to.deep.equal(["varA"]);

        });

        describe('When a url is expected to match - POST /someRoute/123-abc_456', function () {

            beforeEach(function () {
                this.matchedRoute = this.router.matchPath('POST', '/someRoute/123-abc_456');
            });

            it('Should return the expected route', function () {

                expect(this.matchedRoute.specification).to.equal('/someRoute/:varA/');
                expect(this.matchedRoute.method).to.equal('post');
                expect(this.matchedRoute.params).to.deep.equal({varA: '123-abc_456'});
                expect(this.matchedRoute.preHandlers.length).to.equal(2);
                expect(this.matchedRoute.preHandlers).to.deep.equal(this.mockPreHandlers);
                expect(this.matchedRoute.finalHandler).to.deep.equal(this.mockFinalHandler);

            });

        });

        describe('When a url is expected to match - POST /someRoute/123-abc_456/', function () {

            beforeEach(function () {
                this.matchedRoute = this.router.matchPath('POST', '/someRoute/123-abc_456/');
            });

            it('Should return the expected route', function () {

                expect(this.matchedRoute.specification).to.equal('/someRoute/:varA/');
                expect(this.matchedRoute.method).to.equal('post');
                expect(this.matchedRoute.params).to.deep.equal({varA: '123-abc_456'});
                expect(this.matchedRoute.preHandlers.length).to.equal(2);
                expect(this.matchedRoute.preHandlers).to.deep.equal(this.mockPreHandlers);
                expect(this.matchedRoute.finalHandler).to.deep.equal(this.mockFinalHandler);

            });

        });

        describe('When a url is not expected to match - POST /someRoute/123-abc/_456/', function () {

            beforeEach(function () {

                this.matchedRoute = this.router.matchPath('POST', '/someRoute/123-abc/_456/');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.equal(undefined);

            });

        });

    });

    describe('When adding a route specification with multiple variable components - /someRoute/:varA/component/:varB', function () {

        beforeEach(function () {

            this.router.addRoute('POST', '/someRoute/:varA/component/:varB', this.mockFinalHandler);

        });

        it('Should add a route to the routes collection', function () {

            expect(this.router.routes.length).to.equal(1);

        });

        it('Should add a route with the given http method - POST', function () {

            expect(this.router.routes[0].method).to.equal('post');

        });

        it('Should add a route with the given route specification - /someRoute/:varA/component/:varB', function () {

            expect(this.router.routes[0].routeSpec).to.equal('/someRoute/:varA/component/:varB');

        });

        it('Should add a route with a regex created from the specification, with optional trailing slash', function () {

            expect(this.router.routes[0].regex.toString()).to.equal(/^\/someRoute\/([a-z0-9%\-_\.]+)\/component\/([a-z0-9%\-_\.]+)(?:\/)?$/i.toString());

        });

        it('Should add a route that has multiple variable components - varA and varB', function () {

            expect(this.router.routes[0].variableComponents).to.deep.equal(["varA", "varB"]);

        });

        describe('When a url is expected to match - POST /someRoute/123-abc_456/component/abc_12-3', function () {

            beforeEach(function () {
                this.matchedRoute = this.router.matchPath('POST', '/someRoute/123-abc_456/component/abc_12-3');
            });

            it('Should return the expected route', function () {

                expect(this.matchedRoute.specification).to.equal('/someRoute/:varA/component/:varB');
                expect(this.matchedRoute.method).to.equal('post');
                expect(this.matchedRoute.params).to.deep.equal({
                    varA: "123-abc_456",
                    varB: "abc_12-3"
                });
                expect(this.matchedRoute.preHandlers).to.deep.equal([]);
                expect(this.matchedRoute.finalHandler).to.deep.equal(this.mockFinalHandler);

            });

        });

        describe('When a url is expected to match - POST /someRoute/123-abc_456/component/abc_12-3/', function () {

            beforeEach(function () {
                this.matchedRoute = this.router.matchPath('POST', '/someRoute/123-abc_456/component/abc_12-3/');
            });

            it('Should return the expected route', function () {

                expect(this.matchedRoute.specification).to.equal('/someRoute/:varA/component/:varB');
                expect(this.matchedRoute.method).to.equal('post');
                expect(this.matchedRoute.params).to.deep.equal({
                    varA: "123-abc_456",
                    varB: "abc_12-3"
                });
                expect(this.matchedRoute.preHandlers).to.deep.equal([]);
                expect(this.matchedRoute.finalHandler).to.deep.equal(this.mockFinalHandler);

            });

        });

        describe('When a url is not expected to match - GET /someRoute/123-abc_456/component/abc_12-3/', function () {

            beforeEach(function () {

                this.matchedRoute = this.router.matchPath('get', '/someRoute/123-abc_456/component/abc_12-3/');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.equal(undefined);

            });

        });

        describe('When a url is not expected to match - POST /someRoute/123-ab$c_456/component/abc_12-3', function () {

            beforeEach(function () {

                this.matchedRoute = this.router.matchPath('POST', '/someRoute/12$3-abc_456/component/abc_12-3');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.equal(undefined);

            });

        });

        describe('When a url is not expected to match - POST /someRoute//component/abc_12-3/', function () {

            beforeEach(function () {

                this.matchedRoute = this.router.matchPath('POST', '/someRoute//component/abc_12-3/');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.equal(undefined);

            });

        });

        describe('When a url is not expected to match - POST /someRoute///component/abc_12-3/', function () {

            beforeEach(function () {

                this.matchedRoute = this.router.matchPath('POST', '/someRoute///component/abc_12-3/');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.equal(undefined);

            });

        });

        describe('When a url is not expected to match - POST /someRoute/123-abc_456/component/abc_12-3/test', function () {

            beforeEach(function () {

                this.matchedRoute = this.router.matchPath('POST', '/someRoute/123-abc_456/component/abc_12-3/test');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.equal(undefined);

            });

        });

    });


    describe('When adding a route specification with a trailing slash and multiple variable components - /someRoute/:varA/component/:varB/', function () {

        beforeEach(function () {

            this.router.addRoute('POST', '/someRoute/:varA/component/:varB/', this.mockFinalHandler);

        });

        it('Should add a route to the routes collection', function () {

            expect(this.router.routes.length).to.equal(1);

        });

        it('Should add a route with the given http method - POST', function () {

            expect(this.router.routes[0].method).to.equal('post');

        });

        it('Should add a route with the given route specification - /someRoute/:varA/component/:varB/', function () {

            expect(this.router.routes[0].routeSpec).to.equal('/someRoute/:varA/component/:varB/');

        });

        it('Should add a route with a regex created from the specification, with optional trailing slash', function () {

            expect(this.router.routes[0].regex.toString()).to.equal(/^\/someRoute\/([a-z0-9%\-_\.]+)\/component\/([a-z0-9%\-_\.]+)(?:\/)?$/i.toString());

        });

        it('Should add a route that has multiple variable components - varA and varB', function () {

            expect(this.router.routes[0].variableComponents).to.deep.equal(["varA", "varB"]);

        });

        describe('When a url is expected to match - POST /someRoute/123-abc_456/component/abc_12-3', function () {

            beforeEach(function () {
                this.matchedRoute = this.router.matchPath('POST', '/someRoute/123-abc_456/component/abc_12-3');
            });

            it('Should return the expected route', function () {

                expect(this.matchedRoute.specification).to.equal('/someRoute/:varA/component/:varB/');
                expect(this.matchedRoute.method).to.equal('post');
                expect(this.matchedRoute.params).to.deep.equal({
                    varA: "123-abc_456",
                    varB: "abc_12-3"
                });
                expect(this.matchedRoute.preHandlers).to.deep.equal([]);
                expect(this.matchedRoute.finalHandler).to.deep.equal(this.mockFinalHandler);

            });

        });

        describe('When a url is expected to match - POST /someRoute/123-abc_456/component/abc_12-3/', function () {

            beforeEach(function () {
                this.matchedRoute = this.router.matchPath('POST', '/someRoute/123-abc_456/component/abc_12-3/');
            });

            it('Should return the expected route', function () {

                expect(this.matchedRoute.specification).to.equal('/someRoute/:varA/component/:varB/');
                expect(this.matchedRoute.method).to.equal('post');
                expect(this.matchedRoute.params).to.deep.equal({
                    varA: "123-abc_456",
                    varB: "abc_12-3"
                });
                expect(this.matchedRoute.preHandlers).to.deep.equal([]);
                expect(this.matchedRoute.finalHandler).to.deep.equal(this.mockFinalHandler);

            });

        });

        describe('When a url is not expected to match - GET /someRoute/123-abc_456/component/abc_12-3/', function () {

            beforeEach(function () {

                this.matchedRoute = this.router.matchPath('get', '/someRoute/123-abc_456/component/abc_12-3/');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.equal(undefined);

            });

        });

        describe('When a url is not expected to match - POST /someRoute/123-ab$c_456/component/abc_12-3', function () {

            beforeEach(function () {

                this.matchedRoute = this.router.matchPath('POST', '/someRoute/12$3-abc_456/component/abc_12-3');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.equal(undefined);

            });

        });

        describe('When a url is not expected to match - POST /someRoute//component/abc_12-3/', function () {

            beforeEach(function () {

                this.matchedRoute = this.router.matchPath('POST', '/someRoute//component/abc_12-3/');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.equal(undefined);

            });

        });

        describe('When a url is not expected to match - POST /someRoute///component/abc_12-3/', function () {

            beforeEach(function () {

                this.matchedRoute = this.router.matchPath('POST', '/someRoute///component/abc_12-3/');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.equal(undefined);

            });

        });

        describe('When a url is not expected to match - POST /someRoute/123-abc_456/component/abc_12-3/test', function () {

            beforeEach(function () {

                this.matchedRoute = this.router.matchPath('POST', '/someRoute/123-abc_456/component/abc_12-3/test');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.equal(undefined);

            });

        });
    });

    describe('When adding a route specification with a wildcard the end of a specification with no other variable components - /someRoute/*', function () {

        beforeEach(function () {

            this.router.addRoute('PUT', '/someRoute/*', this.mockFinalHandler);

        });

        it('Should add a route to the routes collection', function () {

            expect(this.router.routes.length).to.equal(1);

        });

        it('Should add a route with the given http method - PUT', function () {

            expect(this.router.routes[0].method).to.equal('put');

        });

        it('Should add a route with the given route specification - /someRoute/*', function () {

            expect(this.router.routes[0].routeSpec).to.equal('/someRoute/*');

        });

        it('Should add a route with a regex created from the specification, where the slash must be present before the wildcard (even if empty), but with an optional trailing slash', function () {

            expect(this.router.routes[0].regex.toString()).to.equal(/^\/someRoute\/[a-z0-9%\-_\.\/]*(?:\/)?$/i.toString());

        });

        it('Should add a route that with no variable components', function () {

            expect(this.router.routes[0].variableComponents).to.deep.equal([]);

        });


        describe('When a url is expected to match - PUT /someRoute/', function () {

            beforeEach(function () {

                this.matchedRoute = this.router.matchPath('PUT', '/someRoute/');

            });

            it('Should return the expected route', function () {

                expect(this.matchedRoute.specification).to.equal('/someRoute/*');
                expect(this.matchedRoute.method).to.equal('put');
                expect(this.matchedRoute.params).to.deep.equal({});
                expect(this.matchedRoute.preHandlers).to.deep.equal([]);
                expect(this.matchedRoute.finalHandler).to.deep.equal(this.mockFinalHandler);

            });

        });

        describe('When a url is expected to match - PUT /someRoute/abc-123_456/test', function () {

            beforeEach(function () {

                this.matchedRoute = this.router.matchPath('PUT', '/someRoute/abc-123_456/test');

            });

            it('Should return the expected route', function () {

                expect(this.matchedRoute.specification).to.equal('/someRoute/*');
                expect(this.matchedRoute.method).to.equal('put');
                expect(this.matchedRoute.params).to.deep.equal({});
                expect(this.matchedRoute.preHandlers).to.deep.equal([]);
                expect(this.matchedRoute.finalHandler).to.deep.equal(this.mockFinalHandler);

            });

        });

        describe('When a url is not expected to match - PUT /someRoute', function () {

            beforeEach(function () {

                this.matchedRoute = this.router.matchPath('put', '/someRoute');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.equal(undefined);

            });

        });

        describe('When a url is not expected to match - POST /someRoute/', function () {

            beforeEach(function () {

                this.matchedRoute = this.router.matchPath('post', '/someRoute');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.equal(undefined);

            });

        });

    });

    describe('When adding a route specification with a wildcard the end of a specification with variable components - /someRoute/:varA/:varB/*', function () {

        beforeEach(function () {

            this.router.addRoute('GET', '/someRoute/:varA/:varB/*', this.mockFinalHandler);

        });

        it('Should add a route to the routes collection', function () {

            expect(this.router.routes.length).to.equal(1);

        });

        it('Should add a route with the given http method - GET', function () {

            expect(this.router.routes[0].method).to.equal('get');

        });

        it('Should add a route with the given route specification - /someRoute/:varA/:varB/*', function () {

            expect(this.router.routes[0].routeSpec).to.equal('/someRoute/:varA/:varB/*');

        });

        it('Should add a route with a regex created from the specification, where the slash must be present before the wildcard (even if empty), but with an optional trailing slash', function () {

            expect(this.router.routes[0].regex.toString()).to.equal(/^\/someRoute\/([a-z0-9%\-_\.]+)\/([a-z0-9%\-_\.]+)\/[a-z0-9%\-_\.\/]*(?:\/)?$/i.toString());

        });

        it('Should add a route that with the correct number of variable components - varA and varB', function () {

            expect(this.router.routes[0].variableComponents).to.deep.equal(['varA', 'varB']);

        });

        describe('When a url is expected to match - GET /someRoute/abc-123_456/123_456-abc/', function () {

            beforeEach(function () {

                this.matchedRoute = this.router.matchPath('get', '/someRoute/abc-123_456/123_456-abc/');

            });

            it('Should return the expected route', function () {

                expect(this.matchedRoute.specification).to.equal('/someRoute/:varA/:varB/*');
                expect(this.matchedRoute.method).to.equal('get');
                expect(this.matchedRoute.params).to.deep.equal({
                    varA: "abc-123_456",
                    varB: "123_456-abc"
                });
                expect(this.matchedRoute.preHandlers).to.deep.equal([]);
                expect(this.matchedRoute.finalHandler).to.deep.equal(this.mockFinalHandler);

            });

        });

        describe('When a url is expected to match - GET /someRoute/abc-123_456/123_456-abc/abc', function () {

            beforeEach(function () {

                this.matchedRoute = this.router.matchPath('get', '/someRoute/abc-123_456/123_456-abc/abc');

            });

            it('Should return the expected route', function () {

                expect(this.matchedRoute.specification).to.equal('/someRoute/:varA/:varB/*');
                expect(this.matchedRoute.method).to.equal('get');
                expect(this.matchedRoute.params).to.deep.equal({
                    varA: "abc-123_456",
                    varB: "123_456-abc"
                });
                expect(this.matchedRoute.preHandlers).to.deep.equal([]);
                expect(this.matchedRoute.finalHandler).to.deep.equal(this.mockFinalHandler);

            });

        });

        describe('When a url is expected to match - GET /someRoute/abc-123_456/123_456-abc/abc/', function () {

            beforeEach(function () {

                this.matchedRoute = this.router.matchPath('get', '/someRoute/abc-123_456/123_456-abc/abc/');

            });

            it('Should return the expected route', function () {

                expect(this.matchedRoute.specification).to.equal('/someRoute/:varA/:varB/*');
                expect(this.matchedRoute.method).to.equal('get');
                expect(this.matchedRoute.params).to.deep.equal({
                    varA: "abc-123_456",
                    varB: "123_456-abc"
                });
                expect(this.matchedRoute.preHandlers).to.deep.equal([]);
                expect(this.matchedRoute.finalHandler).to.deep.equal(this.mockFinalHandler);

            });

        });

        describe('When a url is not expected to match - GET /someRoute/abc-123_456/123_456-abc', function () {

            beforeEach(function () {

                this.matchedRoute = this.router.matchPath('get', '/someRoute/abc-123_456/123_456-abc');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.equal(undefined);

            });

        });

        describe('When a url is not expected to match - GET /someRoute/abc-123_456/', function () {

            beforeEach(function () {

                this.matchedRoute = this.router.matchPath('get', '/someRoute/abc-123_456/');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.equal(undefined);

            });

        });

        describe('When a url is not expected to match - GET /someRoute/abc-123_456//test', function () {

            beforeEach(function () {

                this.matchedRoute = this.router.matchPath('get', '/someRoute/abc-123_456//test');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.equal(undefined);

            });

        });

        describe('When a url is not expected to match - GET /someRoute//123_456-abc/test/case', function () {

            beforeEach(function () {

                this.matchedRoute = this.router.matchPath('get', '/someRoute//123_456-abc/test/case');

            });

            it('Should return an undefined route', function () {

                expect(this.matchedRoute).to.equal(undefined);

            });

        });

    });

});
