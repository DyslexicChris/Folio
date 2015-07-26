var expect = require('chai').expect;
var assert = require('chai').assert;
var Stubs = require('../Helpers/Stubs');
var ObjectDecorator = require('../../../lib/decorators/ObjectDecorator.js');

describe('ObjectDecorator', function () {

    beforeEach(function () {

        this.mockDecorationA = Stubs.newDecoration();
        this.mockDecorationB = Stubs.newDecoration();

    });

    describe('On new', function () {

        beforeEach(function () {

            this.objectDecorator = new ObjectDecorator();

        });

        it('Should not be undefined', function () {

            expect(this.objectDecorator).to.not.be.undefined;

        });

        describe('When adding decorations', function () {

            beforeEach(function () {

                this.objectDecorator.addDecoration(this.mockDecorationA, this.mockDecorationB);

            });

            describe('Then when decorating an object', function () {

                beforeEach(function () {

                    this.object = {object: 'toDecorate'};
                    this.objectDecorator.decorate(this.object);

                });

                it('Should have each decoration decorate the given object', function () {

                    assert(this.mockDecorationA.decorate.calledWithExactly(this.object));
                    assert(this.mockDecorationB.decorate.calledWithExactly(this.object));

                });

            });

        });

    });

});
