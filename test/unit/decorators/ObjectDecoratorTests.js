var expect = require('chai').expect;
var sinon = require('sinon');
var _ = require('underscore');
var ObjectDecorator = require('../../../lib/decorators/ObjectDecorator.js');

describe('ObjectDecorator', function () {

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

            this.objectDecorator = new ObjectDecorator();

        });

        it('Should not be undefined', function () {

            expect(this.objectDecorator).to.not.be.undefined;

        });

        describe('When adding decorations', function () {

            beforeEach(function () {

                this.mockDecorationA = {
                    name: function(){
                        return 'testA';
                    },
                    function: function(){
                    }
                };

                this.mockDecorationB = {
                    name: function(){
                        return 'testB';
                    },
                    function: function(){
                    }
                };

                this.objectDecorator.addDecoration(this.mockDecorationA, this.mockDecorationB);

            });

            describe('Then when decorating an object', function(){

                beforeEach(function(){

                    this.object = {};
                    this.objectDecorator.decorate(this.object);

                });

                it('Should decorate the object with the decorations added previously', function(){

                    expect(this.object.testA).to.equal(this.mockDecorationA.function);
                    expect(this.object.testB).to.equal(this.mockDecorationB.function);

                });

            });

        });

    });

});
