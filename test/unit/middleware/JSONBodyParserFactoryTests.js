var expect = require('chai').expect;
var assert = require('chai').assert;
var Stubs = require('../Helpers/Stubs');
var sinon = require('sinon');
var JSONBodyParserFactory = require('../../../lib/middleware/JSONBodyParserFactory');


describe('JSONBodyParserFactory', function () {

    describe('On new with no max body size given', function () {

        beforeEach(function () {

            this.jsonBodyParserFactory = new JSONBodyParserFactory();

        });

        it('Should not be undefined', function(){

            expect(this.jsonBodyParserFactory).to.not.be.undefined;

        });

        it('Should have the default max body size set', function(){

            expect(this.jsonBodyParserFactory.maxBodySize()).to.equal(4194304);

        });

    });

    describe('On new with a max body size of 5MB given', function () {

        beforeEach(function () {

            this.jsonBodyParserFactory = new JSONBodyParserFactory(5);
            this.jsonBodyParser = this.jsonBodyParserFactory.newMiddleware();

        });

        it('Should not be null', function(){

            expect(this.jsonBodyParserFactory).to.not.be.undefined;

        });

        it('Should have the correct max body size set in bytes', function(){

            expect(this.jsonBodyParserFactory.maxBodySize()).to.equal(5242880);

        });

        it('Should return a middleware function when asked', function(){

            expect(this.jsonBodyParser).to.not.be.undefined;

        });

        describe('Given a request carrying valid JSON under the max body size', function(){


            beforeEach(function(){

                this.mockRequest = Stubs.newRequestFromFile(__dirname + '/../../test-data/json-body-parser-valid.json');
                this.mockResponse = Stubs.newResponse();

            });

            it('Should parse JSON correctly, attach parsed object to the request, and call the next middleware/handler function', function(done){

                this.jsonBodyParser(this.mockRequest, this.mockResponse, function(){

                    expect(this.mockRequest.body).to.deep.equal({
                        myObject: 'myValue',
                        otherProperty: 'otherValue'
                    });

                    done();

                }.bind(this));

            });

        });

        describe('Given a request carrying invalid JSON under the max body size', function(){

            beforeEach(function(){

                this.mockRequest = Stubs.newRequestFromFile(__dirname + '/../../test-data/json-body-parser-invalid.json');
                this.mockResponse = Stubs.newResponse();

            });

            it('Should not parse JSON and therefore not attach parsed object to the request, but still call the next middleware/handler function', function(done){

                this.jsonBodyParser(this.mockRequest, this.mockResponse, function(){
                    expect(this.mockRequest.body).to.be.undefined;
                    done();
                }.bind(this));

            });

            it('Should set the "badJSON" flag to true on the request object', function(done){

                this.jsonBodyParser(this.mockRequest, this.mockResponse, function(){
                    expect(this.mockRequest.badJSON).to.equal(true);
                    done();
                }.bind(this));

            });

        });

        describe('Given a request carrying data that is over the max body size', function(){

            beforeEach(function(){

                this.mockRequest = Stubs.newRequest();
                this.mockRequest.on.withArgs('data', sinon.match.any).callsArgWith(1, 'someData');
                this.mockRequest.on.withArgs('end', sinon.match.any).callsArg(1);

                this.mockResponse = Stubs.newResponse();
                this.mockResponse.statusCode = 100;

                this.nextFunction = Stubs.newFunction();

                this.jsonBodyParserFactory = new JSONBodyParserFactory(-1);
                this.jsonBodyParser = this.jsonBodyParserFactory.newMiddleware();
                this.jsonBodyParser(this.mockRequest, this.mockResponse, this.nextFunction);

            });

            it('Should send a 413 - "Request too large" response', function(){

                expect(this.mockResponse.statusCode).to.equal(413);
                assert(this.mockResponse.end.calledOnce);

            });

            it('Should destroy the request connection', function(){

                assert(this.mockRequest.connection.destroy.calledOnce);

            });

            it('Should not call the next middlware/handler function', function(){

                expect(this.nextFunction.notCalled);

            });

        });

    });

});
