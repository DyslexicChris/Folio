var _ = require('underscore');
var expect = require('chai').expect;
var sinon = require('sinon');
var mockery = require('mockery');
var fs = require('fs');


describe('JSONBodyParser', function () {

    beforeEach(function () {

        this.spies = {};

        mockery.disable();

        this.JSONBodyParser = require('../../lib/middleware/JSONBodyParser');

    });

    afterEach(function () {
        _.each(this.spies, function (spy) {
            spy.restore();
        })
    });

    describe('On new with no max body size given', function () {

        beforeEach(function () {

            this.jsonBodyParser = new this.JSONBodyParser();

        });

        it('Should not be null', function(){

            expect(this.jsonBodyParser).to.not.equal(undefined);

        });

        it('Should have the default max body size set', function(){

            expect(this.jsonBodyParser.maxBodySize).to.equal(4194304);

        });

    });

    describe('On new with a max body size of 5MB given', function () {

        beforeEach(function () {

            this.jsonBodyParser = new this.JSONBodyParser(5);

        });

        it('Should not be null', function(){

            expect(this.jsonBodyParser).to.not.equal(undefined);

        });

        it('Should have the correct max body size set in bytes', function(){

            expect(this.jsonBodyParser.maxBodySize).to.equal(5242880);

        });

        describe('Given a request carrying valid JSON under the max body size', function(){


            beforeEach(function(){

                this.mockRequest = fs.createReadStream(__dirname + '/../test-data/json-body-parser-valid.json', {
                    encoding: 'utf8'
                });

                this.mockResponse = {};

            });

            it('Should parse JSON correctly, attach parsed object to the request, and call the next middleware/handler function', function(done){

                var thisTest = this;
                this.jsonBodyParser.parseJSONBody(this.mockRequest, this.mockResponse, function(){

                    expect(thisTest.mockRequest.body).to.deep.equal({
                        myObject: 'myValue',
                        otherProperty: 'otherValue'
                    });

                    done();

                });

            });

        });

        describe('Given a request carrying invalid JSON under the max body size', function(){


            beforeEach(function(){

                this.mockRequest = fs.createReadStream(__dirname + '/../test-data/json-body-parser-invalid.json', {
                    encoding: 'utf8'
                });

                this.mockResponse = {};

            });

            it('Should not parse JSON and therefore not attach parsed object to the request, but still call the next middleware/handler function', function(done){

                var thisTest = this;
                this.jsonBodyParser.parseJSONBody(this.mockRequest, this.mockResponse, function(){
                    expect(thisTest.mockRequest.body).to.deep.equal(undefined);
                    done();
                });

            });

            it('Should set the "badJSON" flag to true on the request object', function(done){

                var thisTest = this;
                this.jsonBodyParser.parseJSONBody(this.mockRequest, this.mockResponse, function(){
                    expect(thisTest.mockRequest.badJSON).to.equal(true);
                    done();
                });

            });

        });

        describe('Given a request carrying data that is over the max body size', function(){


            beforeEach(function(){

                this.mockRequest = {
                    on: function(event, callback){
                        if(event == 'data'){
                            callback('someData');
                        } else if(event == 'end'){
                            callback();
                        }
                    }
                };

                this.mockRequest.connection = {
                    destroy: function(){}
                };

                this.mockResponse = {
                    statusCode:100,
                    end: function(){
                    }
                };

                this.nextFunction = function(){};

                this.jsonBodyParser.maxBodySize = -1;

                this.spies.responseEnd = sinon.spy(this.mockResponse, 'end');
                this.spies.requestConnectionDestroy = sinon.spy(this.mockRequest.connection, 'destroy');
                this.spies.nextFunction = sinon.spy(this, 'nextFunction');

                this.jsonBodyParser.parseJSONBody(this.mockRequest, this.mockResponse, this.nextFunction);

            });

            it('Should send a 413 - "Request too large" response', function(){

                expect(this.mockResponse.statusCode).to.equal(413);
                expect(this.mockResponse.end.callCount).to.equal(1);

            });

            it('Should destroy the request connection', function(){

                expect(this.mockRequest.connection.destroy.callCount).to.equal(1);

            });

            it('Should not call the next middlware/handler function', function(){

                expect(this.nextFunction.callCount).to.equal(0);

            });

        });

    });

});
