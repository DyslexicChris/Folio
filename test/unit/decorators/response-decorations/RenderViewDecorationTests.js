var expect = require('chai').expect;
var assert = require('chai').assert;
var Stubs = require('../../Helpers/Stubs');
var RenderViewDecoration = require('../../../../lib/decorators/response-decorations/RenderViewDecoration');

describe('RenderViewDecoration', function () {

    describe('On new', function () {

        beforeEach(function () {

            this.renderEngine = Stubs.newRenderEngine();
            this.renderEngine.render.withArgs('mockViewName', {'model': 'test'}).returns('Rendered Content');
            this.renderViewDecoration = new RenderViewDecoration(this.renderEngine);

        });

        it('Should not be undefined', function () {

            expect(this.renderViewDecoration).to.not.be.undefined;

        });

        describe('when decorating a response', function () {

            beforeEach(function () {

                this.response = Stubs.newResponse();
                this.renderViewDecoration.decorate(this.response);

            });

            describe('and then using the decoration', function () {

                beforeEach(function () {

                    this.response.renderView('mockViewName', {'model': 'test'});

                });

                it('Should set a 200 status code if a status code is not already set', function () {

                    expect(this.response.statusCode).to.equal(200);

                });

                it('Should not modify the status code if a status code is already set', function () {

                    this.response.statusCode = 300;
                    this.response.renderView('mockViewName', {'model': 'test'});

                    expect(this.response.statusCode).to.equal(300);

                });

                it('Should set the Content-Type header to "text/html" if not already set', function () {

                    assert(this.response.setHeader.calledOnce);
                    assert(this.response.setHeader.calledWithExactly('Content-Type', 'text/html'));

                });

                it('Should not set the Content-Type header if already set', function () {

                    this.response.getHeader.returns('application/json');
                    this.response.setHeader.reset();
                    this.response.renderView('mockViewName', {'model': 'test'});

                    assert(this.response.setHeader.notCalled);

                });

                it('Should end the response with the rendered content', function () {

                    assert(this.response.end.calledWithExactly("Rendered Content"));

                });

            });

        });

    });

});
