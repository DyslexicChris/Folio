var expect = require('chai').expect;
var sinon = require('sinon');
var _ = require('underscore');
var SendObjectDecoration = require('../../../../lib/decorators/response-decorations/SendObjectDecoration');

describe('SendObjectDecoration', function () {

    beforeEach(function () {

        this.spies = {};

    });

    afterEach(function () {
        _.each(this.spies, function (spy) {
            spy.reset();
            spy.restore();
        });
    });

    describe('On new', function () {

        beforeEach(function () {

            this.sendObjectDecoration = new SendObjectDecoration();

        });

        it('Should not be undefined', function () {

            expect(this.sendObjectDecoration).to.not.be.undefined;

        });

        describe('name()', function () {

            it('Should return \'send\'', function () {

                expect(this.sendObjectDecoration.name());

            })

        });

        describe('function(), when bound to a response', function () {

            beforeEach(function () {

                this.response = {
                    end: function () {
                    },
                    write: function () {
                    },
                    setHeader: function () {
                    }
                };

                this.spies.responseSetHeader = sinon.spy(this.response, 'setHeader');
                this.spies.responseWrite = sinon.spy(this.response, 'write');
                this.spies.responseEnd = sinon.spy(this.response, 'end');

                this.response.send = this.sendObjectDecoration.function;


            });

            it('Should set a 200 status code if a status code is not already set', function () {

                this.response.send({
                    myObject: 'myValue'
                });

                expect(this.response.statusCode).to.equal(200);

            });

            it('Should not modify the status code if a status code is already set', function () {

                this.response.statusCode = 300;
                this.response.send({
                    myObject: 'myValue'
                });

                expect(this.response.statusCode).to.equal(300);

            });

            it('Should set the Content-Type header to "application/json"', function () {

                this.response.send({
                    myObject: 'myValue'
                });

                expect(this.response.setHeader.callCount).to.equal(1);
                expect(this.response.setHeader.getCall(0).args).to.deep.equal([
                    'Content-Type',
                    'application/json'
                ]);

            });

            it('Should write the object to the response as JSON', function () {

                this.response.send({
                    myObject: 'myValue'
                });

                expect(this.response.write.callCount).to.equal(1);
                expect(this.response.write.getCall(0).args).to.deep.equal([
                    '{"myObject":"myValue"}',
                ]);

            });

            it('Should end the response', function () {

                this.response.send({
                    myObject: 'myValue'
                });

                expect(this.response.end.callCount).to.equal(1);

            });

        });

    });

});
