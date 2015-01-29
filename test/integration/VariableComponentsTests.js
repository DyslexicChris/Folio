var test = require('../test-helpers/IntegrationTestHelpers');

describe('Variable component examples', function () {

    describe('With a route defined with no variable components or wildcards - /some.Route', function () {

        beforeEach(function () {

            this.app.get('/some.Route').handler(test.echoParamsHanlder());
        });

        describe('On GET /some.Route', function () {

            beforeEach(function (done) {

                test.getPath('/some.Route', this, done);

            });

            it('Should echo back with no params', function () {

                test.assertResponseBodyWithObject({
                    params: {}
                }, this);

            });

        });

    });

    describe('With a route defined with one variable components but no wildcards - /some.Route/:varA/', function () {

        beforeEach(function () {

            this.app.get('/some.Route/:varA/').handler(test.echoParamsHanlder());
        });

        describe('On GET /some.Route/', function () {

            beforeEach(function (done) {

                test.getPath('/some.Route/', this, done);

            });

            it('Should 404', function () {

                test.assertStatusCode(404, this);

            });

        });

        describe('On GET /some.Route/ABC123', function () {

            beforeEach(function (done) {

                test.getPath('/some.Route/ABC123', this, done);

            });

            it('Should respond with a 200 OK', function () {

                test.assertStatusCode(200, this);

            });

            it('Should echo back with the correct params', function () {

                test.assertResponseBodyWithObject({
                    params: {
                        'varA': 'ABC123'
                    }
                }, this);

            });

        });

        describe('On GET /some.Route/ABC123/WORLD', function () {

            beforeEach(function (done) {

                test.getPath('/some.Route/ABC123/WORLD', this, done);

            });

            it('Should 404', function () {

                test.assertStatusCode(404, this);

            });

        });

    });

    describe('With a route defined with two variable components but no wildcards - /some.Route/:varA/component/:varB', function () {

        beforeEach(function () {

            this.app.get('/some.Route/:varA/component/:varB').handler(test.echoParamsHanlder());
        });

        describe('On GET /some.Route/', function () {

            beforeEach(function (done) {

                test.getPath('/some.Route/', this, done);

            });

            it('Should 404', function () {

                test.assertStatusCode(404, this);

            });

        });

        describe('On GET /some.Route/ABC', function () {

            beforeEach(function (done) {

                test.getPath('/some.Route/ABC', this, done);

            });

            it('Should 404', function () {

                test.assertStatusCode(404, this);

            });

        });

        describe('On GET /some.Route/ABC/component', function () {

            beforeEach(function (done) {

                test.getPath('/some.Route/ABC/component', this, done);

            });

            it('Should 404', function () {

                test.assertStatusCode(404, this);

            });

        });

        describe('On GET /some.Route/ABC/component/123', function () {

            beforeEach(function (done) {

                test.getPath('/some.Route/ABC/component/123', this, done);

            });

            it('Should respond with a 200 OK', function () {

                test.assertStatusCode(200, this);

            });

            it('Should echo back with the correct params', function () {

                test.assertResponseBodyWithObject({
                    params: {
                        varA: 'ABC',
                        varB: '123'
                    }
                }, this);

            });

        });

    });


    describe('With a route defined with no variable components but with a wildcard - /some.Route/*', function () {

        beforeEach(function () {

            this.app.get('/some.Route/*').handler(test.echoParamsHanlder());
        });

        describe('On GET /some.Route', function () {

            beforeEach(function (done) {

                test.getPath('/some.Route', this, done);

            });

            it('Should 404', function () {

                test.assertStatusCode(404, this);

            });

        });

        describe('On GET /some.Route/Test-123', function () {

            beforeEach(function (done) {

                test.getPath('/some.Route/Test-123', this, done);

            });

            it('Should 200', function () {

                test.assertStatusCode(200, this);

            });

            it('Should echo back with no params', function () {

                test.assertResponseBodyWithObject({
                    params: {}
                }, this);

            });

        });

    });

    describe('With a route defined with two variable components and with a wildcard - /some.Route/:varA/:varB/*', function () {

        beforeEach(function () {

            this.app.get('/some.Route/:varA/:varB/*').handler(test.echoParamsHanlder());
        });

        describe('On GET /some.Route', function () {

            beforeEach(function (done) {

                test.getPath('/some.Route', this, done);

            });

            it('Should 404', function () {

                test.assertStatusCode(404, this);

            });

        });

        describe('On GET /some.Route/abc', function () {

            beforeEach(function (done) {

                test.getPath('/some.Route/abc', this, done);

            });

            it('Should 404', function () {

                test.assertStatusCode(404, this);

            });

        });

        describe('On GET /some.Route/abc/123', function () {

            beforeEach(function (done) {

                test.getPath('/some.Route/abc/123', this, done);

            });

            it('Should 404', function () {

                test.assertStatusCode(404, this);

            });

        });

        describe('On GET /some.Route/abc/123/test', function () {

            beforeEach(function (done) {

                test.getPath('/some.Route/abc/123/test', this, done);

            });

            it('Should 200', function () {

                test.assertStatusCode(200, this);

            });

            it('Should echo back with the correct params', function () {

                test.assertResponseBodyWithObject({
                    params: {
                        varA: 'abc',
                        varB: '123'
                    }
                }, this);

            });

        });

    });
});