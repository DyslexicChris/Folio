var test = require('../test-helpers/IntegrationTestHelpers');
var Folio = require('../../index.js');

describe('JSON Body Parser Middleware Tests', function () {

    describe('With a route defined with the JSON Body Parser middleware and a handler that echos the parsed JSON or responds with "Bad JSON" if the badJSON flag has been set by the middleware', function () {

        beforeEach(function () {

            this.app.post('/hello-world')
                .middleware(this.app.jsonBodyParser())
                .handler(function (request, response) {

                    var badJSON = request.badJSON;
                    var responseBody = badJSON ? 'Bad JSON' : JSON.stringify(request.body);

                    response.writeHead(200, {
                        'Content-Length': responseBody.length,
                        'Content-Type': 'text/plain' });

                    responseBody && response.write(responseBody);
                    response.end();
                });

        });

        describe('On POST with valid JSON body', function () {

            beforeEach(function (done) {

                var body = JSON.stringify({
                    someObject: {
                        stringValue: 'test'
                    },
                    otherObject: {
                        integerValue: 123
                    }
                });

                test.postPath('/hello-world', body, this, done);

            });

            it('Should echo the correct JSON', function () {

                test.assertStatusCode(200, this);
                test.assertResponseBody('{\"someObject\":{\"stringValue\":\"test\"},\"otherObject\":{\"integerValue\":123}}', this);

            });

        });

        describe('On POST with invalid JSON body', function () {

            beforeEach(function (done) {

                test.postPath('/hello-world', 'Some arbitrary string, this isn\'t JSON', this, done);

            });

            it('Should respond with "Bad JSON" - as defined by the test handler', function () {

                test.assertStatusCode(200, this);
                test.assertResponseBody('Bad JSON', this);

            });

        });

    });

});

