var expect = require('chai').expect;
var Folio = require('../../index');

var TEST_PORT = 8050;

beforeEach(function (done) {

    this.app = new Folio();
    this.app.start(TEST_PORT, done);

});

afterEach(function(done){

    try {
        this.app.stop(done);
    } catch (error){}

});

afterEach(function () {

    this.app.reset();

});

describe('The Folio Framework', function(){

    require('./BasicRouteDefinitionsAndHandlersTests.js');
    require('./BasicMiddlewareTests.js');
    require('./JSONBodyParserMiddlewareTests.js');

});