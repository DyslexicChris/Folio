var expect = require('chai').expect;
var assert = require('chai').assert;
var Stubs = require('../../Helpers/Stubs');
var SendObjectDecoration = require('../../../../lib/decorators/response-decorations/SendObjectDecoration');

describe('SendObjectDecoration', function () {

    describe('On new', function () {

        beforeEach(function () {

            this.sendObjectDecoration = new SendObjectDecoration();

        });

        it('Should not be undefined', function () {

            expect(this.sendObjectDecoration).to.not.be.undefined;

        });

        describe('when decorating a response', function () {

            beforeEach(function () {

                this.response = Stubs.newResponse();
                this.sendObjectDecoration.decorate(this.response);

            });

            describe('and then using the decoration', function () {

                beforeEach(function () {

                    this.sendObject = {
                        myObject: 'myValue'
                    };

                    this.response.send(this.sendObject);

                });

                it('Should set a 200 status code if a status code is not already set', function () {

                    expect(this.response.statusCode).to.equal(200);

                });

                it('Should not modify the status code if a status code is already set', function () {

                    this.response.statusCode = 300;
                    this.response.send(this.sendObject);

                    expect(this.response.statusCode).to.equal(300);

                });

                it('Should set the Content-Type header to "application/json"', function () {

                    assert(this.response.setHeader.calledOnce);
                    assert(this.response.setHeader.calledWithExactly('Content-Type', 'application/json'));

                });

                it('Should write the object to the response as JSON', function () {

                    assert(this.response.write.calledOnce);
                    assert(this.response.write.calledWithExactly('{"myObject":"myValue"}'));

                });

                it('Should end the response', function () {

                    assert(this.response.end.calledOnce);

                });

            });

        });

    });

});
