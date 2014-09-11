var expect = require('chai').expect;
var sinon = require('sinon');
var _ = require('underscore');
var ResponseDecorator = require('../../../lib/decorators/ResponseDecorator.js');

describe('ResponseDecorator', function () {

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

            this.responseDecorator = new ResponseDecorator();

        });

        it('Should not be undefined', function () {

            expect(this.responseDecorator).to.not.be.undefined;

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

                this.responseDecorator.addDecoration(this.mockDecorationA, this.mockDecorationB);

            });

            describe('Then when decorating a response', function(){

                beforeEach(function(){

                    this.mockResponse = {};
                    this.responseDecorator.decorate(this.mockResponse);

                });

                it('Should decorate the response with the decorations added previously', function(){

                    expect(this.mockResponse.testA).to.equal(this.mockDecorationA.function);
                    expect(this.mockResponse.testB).to.equal(this.mockDecorationB.function);

                });

            });

        });

    });

});
