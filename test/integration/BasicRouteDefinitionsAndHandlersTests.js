var test = require('../test-helpers/IntegrationTestHelpers');

describe('Basic route definition and handlers', function () {

    describe('With no routes defined', function () {

        describe('On GET /hello-world', function () {

            beforeEach(function (done) {

                test.getPath('/hello-world', this, done);

            });

            it('Should respond with a 404', function () {

                test.assertStatusCode(404, this);

            });

        });

    });

    describe('With a single route defined with specification GET /hello-world but with no handler', function () {

        beforeEach(function () {

            this.app.get('/hello-world');

        });

        describe('On GET /hello-world', function () {

            beforeEach(function (done) {

                test.getPath('/hello-world', this, done);

            });

            it('Should respond with a 404', function () {

                test.assertStatusCode(404, this);

            });

        });

    });

    describe('With a single route defined with specification GET /hello-world with a handler that responds with a 200 status code', function () {

        beforeEach(function () {

            this.app.get('/hello-world').handler(test.terminateWithStatusCode(200));

        });

        describe('On GET /hello-world', function () {

            beforeEach(function (done) {

                test.getPath('/hello-world', this, done);

            });

            it('Should respond with a 200', function () {

                test.assertStatusCode(200, this);

            });

        });

    });

    describe('With two routes defined with specification GET /hello-world and POST /hello-world with handlers that respond with 200 and 204 status codes respectively', function () {

        beforeEach(function () {

            this.app.get('/hello-world').handler(test.terminateWithStatusCode(200));
            this.app.post('/hello-world').handler(test.terminateWithStatusCode(204));

        });

        describe('On GET /hello-world', function () {

            beforeEach(function (done) {

                test.getPath('/hello-world', this, done);

            });

            it('Should respond with a 200', function () {

                test.assertStatusCode(200, this);

            });

        });

        describe('On POST /hello-world', function () {

            beforeEach(function (done) {

                test.requestPath('POST', '/hello-world', null, this, done);

            });

            it('Should respond with a 204', function () {

                test.assertStatusCode(204, this);

            });

        });


    });

    describe('With duplicate routes defined for specification GET /hello-world with handlers that respond with 200 and 204 status codes respectively', function () {

        beforeEach(function () {

            this.app.get('/hello-world').handler(test.terminateWithStatusCode(200));
            this.app.get('/hello-world').handler(test.terminateWithStatusCode(204));

        });

        describe('On GET /hello-world', function () {

            beforeEach(function (done) {

                test.getPath('/hello-world', this, done);

            });

            it('Should respond with using the most recent defined handler for the route (204)', function () {

                test.assertStatusCode(204, this);

            });

        });

        describe('On POST /hello-world', function () {

            beforeEach(function (done) {

                test.requestPath('POST', '/hello-world', null, this, done);

            });

            it('Should respond with a 404', function () {

                test.assertStatusCode(404, this);

            });

        });

    });

});
