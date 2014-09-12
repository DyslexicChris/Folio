var test = require('../test-helpers/IntegrationTestHelpers');

describe('JSON responses using the send object decoration', function () {

    describe('With a single route defined with specification GET /hello-world with a handler that sends back an object', function () {

        beforeEach(function () {

            this.app.get('/hello-world').handler(function (request, response) {

                response.send({
                    myObjects: [
                        {
                            key: 'value',
                            number: 10
                        },
                        {
                            hello: 'world'
                        }
                    ]
                })
            });

        });

        describe('On GET /hello-world', function () {

            beforeEach(function (done) {

                test.getPath('/hello-world', this, done);

            });

            it('Should respond with a 200', function () {

                test.assertStatusCode(200, this);

            });

            it('Should respond with JSON representing the object', function(){

                test.assertResponseBody('{"myObjects":[{"key":"value","number":10},{"hello":"world"}]}', this);

            });

        });

    });

    describe('With a single route defined with specification GET /hello-world with a handler that sets a response status code of 202 and sends back an object', function () {

        beforeEach(function () {

            this.app.get('/hello-world').handler(function (request, response) {

                response.statusCode = 202;

                response.send({
                    myObjects: [
                        {
                            key: 'value',
                            number: 10
                        },
                        {
                            hello: 'world'
                        }
                    ]
                })
            });

        });

        describe('On GET /hello-world', function () {

            beforeEach(function (done) {

                test.getPath('/hello-world', this, done);

            });

            it('Should respond with a 202', function () {

                test.assertStatusCode(202, this);

            });

            it('Should respond with JSON representing the object', function(){

                test.assertResponseBody('{"myObjects":[{"key":"value","number":10},{"hello":"world"}]}', this);

            });

        });

    });

});
