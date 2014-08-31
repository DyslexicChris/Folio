var test = require('../test-helpers/IntegrationTestHelpers');

describe('Basic middleware examples', function () {

    describe('With a route defined with 2 middleware and a handler that together calculate a status code', function () {

        beforeEach(function () {

            this.app.get('/hello-world')
                .middleware(test.addTokenMiddlewareFactory('1'))
                .middleware(test.addTokenMiddlewareFactory('2'))
                .handler(test.addTokenHandlerFactory('3'));

        });

        describe('On GET /hello-world', function () {

            beforeEach(function (done) {

                test.getPath('/hello-world', this, done);

            });

            it('Should respond with the correct status code', function () {

                test.assertStatusCode(123, this);

            });

        });

    });

    describe('With a route defined with 2 middlewares and a handler where the second middleware terminates the handling chain and responds with a 403 status code', function () {

        beforeEach(function () {

            this.app.get('/hello-world')
                .middleware(test.noopMiddleware)
                .middleware(test.terminateWithStatusCode(403))
                .handler(test.terminateWithStatusCode(200));

        });

        describe('On GET /hello-world', function () {

            beforeEach(function (done) {

                test.getPath('/hello-world', this, done);

            });

            it('Should respond with a 403 status code', function () {

                test.assertStatusCode(403, this);

            });

        });

    });

});

