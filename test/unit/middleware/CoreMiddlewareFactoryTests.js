var expect = require('chai').expect;
var assert = require('chai').assert;
var CoreMiddlewareFactory = require('../../../lib/middleware/CoreMiddlewareFactory');

describe('CoreMiddlewareFactory', function () {

    describe('On new', function () {

        beforeEach(function () {

            this.coreMiddlewareFactory = new CoreMiddlewareFactory();

        });

        it('Should not be undefined', function () {

            expect(this.coreMiddlewareFactory).to.not.be.undefined;

        });

        describe('jsonBodyParser()', function () {

            it('Should return a middleware function', function () {

                assert(this.coreMiddlewareFactory.jsonBodyParser() instanceof Function);

            });

        });

    });

});
