var expect = require('chai').expect;
var assert = require('chai').assert;
var ObjectDecorationFactory = require('../../../lib/decorators/ObjectDecorationFactory');
var SendObjectDecoration = require('../../../lib/decorators/response-decorations/SendObjectDecoration');
var RenderObjectDecoration = require('../../../lib/decorators/response-decorations/RenderViewDecoration');

describe('ObjectDecorationFactory', function () {

    describe('On new', function () {

        beforeEach(function () {

            this.objectDecorationFactory = new ObjectDecorationFactory()

        });

        it('Should not be undefined', function () {

            expect(this.objectDecorationFactory).to.not.be.undefined;

        });

        describe('sendObjectDecoration()', function () {

            it('Should return a new send object decoration', function () {

                assert(this.objectDecorationFactory.sendObjectDecoration() instanceof SendObjectDecoration);

            });

        });

        describe('renderViewDecoration()', function () {

            it('Should return a new render view decoration', function () {

                assert(this.objectDecorationFactory.renderViewDecoration() instanceof RenderObjectDecoration);

            });

        });

    });

});
