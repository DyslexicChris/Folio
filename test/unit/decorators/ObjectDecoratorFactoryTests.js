var expect = require('chai').expect;
var assert = require('chai').assert;
var ObjectDecoratorFactory = require('../../../lib/decorators/ObjectDecoratorFactory');
var ObjectDecorationFactory = require('../../../lib/decorators/ObjectDecorationFactory');
var ObjectDecorator = require('../../../lib/decorators/ObjectDecorator');
var SendObjectDecoration = require('../../../lib/decorators/response-decorations/SendObjectDecoration');

describe('ObjectDecoratorFactory', function () {

    describe('On new with no ObjectDecorationFactory', function () {

        it('Should throw', function () {

            expect(function () {
                new ObjectDecoratorFactory()
            }).to.throw('ObjectDecoratorFactory requires ObjectDecorationFactory');

        });

    });

    describe('On new with ObjectDecorationFactory', function () {

        beforeEach(function () {

            this.objectDecorationFactory = new ObjectDecorationFactory();
            this.objectDecoratorFactory = new ObjectDecoratorFactory(this.objectDecorationFactory);

        });

        it('Should not be undefined', function () {

            expect(this.objectDecoratorFactory).to.not.be.undefined;

        });

        describe('requestDecorator()', function () {

            it('Should return a new ObjectDecorator', function () {

                assert(this.objectDecoratorFactory.requestDecorator() instanceof ObjectDecorator);

            });

        });

        describe('responseDecorator()', function () {

            beforeEach(function () {

                this.responseDecorator = this.objectDecoratorFactory.responseDecorator();

            });

            it('Should return a new ObjectDecorator', function () {

                assert(this.responseDecorator instanceof ObjectDecorator);

            });

            it('Should have the SendObjectDecoration as its first decoration', function () {

                assert(this.responseDecorator.decorations[0] instanceof SendObjectDecoration);

            });

        });

    });

});
