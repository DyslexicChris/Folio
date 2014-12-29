var http = require('http');
var expect = require('chai').expect;

module.exports = {
    getTestPort: getTestPort,
    setTestPort: setTestPort,
    getPath: getPath,
    postPath: postPath,
    requestPath: requestPath,
    assertStatusCode: assertStatusCode,
    assertResponseBody: assertResponseBody,
    assertResponseBodyWithObject: assertResponseBodyWithObject,
    addTokenMiddlewareFactory: addTokenMiddlewareFactory,
    addTokenHandlerFactory: addTokenHandlerFactory,
    terminateWithStatusCode: terminateWithStatusCode,
    echoParamsHanlder: echoParamsHanlder,
    noopMiddleware: noopMiddleware
};

var testPort = 8050;

/**
 * @param port
 */
function setTestPort(port) {
    'use strict';

    testPort = port;
}

/**
 * @returns {number}
 */
function getTestPort() {
    'use strict';

    return testPort;
}

/**
 * @param path
 * @param suite
 * @param completion
 */
function getPath(path, suite, completion) {
    'use strict';

    requestPath('GET', path, undefined, suite, completion);
}

/**
 *
 * @param path
 * @param body
 * @param suite
 * @param completion
 */
function postPath(path, body, suite, completion) {
    'use strict';

    requestPath('POST', path, body, suite, completion);
}

/**
 *
 * @param method
 * @param path
 * @param body
 * @param suite
 * @param completion
 */
function requestPath(method, path, body, suite, completion) {
    'use strict';

    var options = {
        hostname: 'localhost',
        port: getTestPort(),
        path: path,
        method: method
    };

    var request = http.request(options, function (response) {

        suite.response = response;
        suite.response.body = '';

        response.on('data', function (chunk) {
            suite.response.body = suite.response.body + chunk;
        });

        response.on('end', function () {
            completion();
        });

        response.on('error', function (error) {
            console.log('Error receiving from test end-point', options, error);
        });

    });

    if (body) {
        request.write(body);
    }

    request.end();
}

/**
 * Asserts a given status code for the previous response.
 *
 * @param statusCode {Integer} The expected status code
 * @param suite {Object} If called from a mocha test, suite should be 'this'
 */
function assertStatusCode(statusCode, suite) {

    expect(suite.response.statusCode).to.equal(statusCode);

}

/**
 * Asserts a given body for the previous response.
 *
 * @param body {String} The expected response body
 * @param suite {Object} If called from a mocha test, suite should be 'this'
 */
function assertResponseBody(body, suite) {

    expect(suite.response.body).to.equal(body);

}

/**
 *
 * Asserts a given response object for the previous response.
 *
 * @param object {Object} The expected response object
 * @param suite {Object} If called from a mocha test, suite should be 'this'
 */
function assertResponseBodyWithObject(object, suite) {

    expect(suite.response.body).to.equal(JSON.stringify(object));

}


/**
 * Returns a middleware that concatenates a given token to request.token
 *
 * @param token
 * @returns {Function} Middleware function
 */
function addTokenMiddlewareFactory(token) {
    return function (request, response, next) {
        request.token = (request.token ? request.token + token : request.token = token);
        next && next();
    };
}

/**
 * Returns a handler that concatenates a given token to request.token, then responds with a status code
 * set to the value of request.token.
 *
 * @param token
 * @returns {Function} Handler function
 */
function addTokenHandlerFactory(token) {
    return function (request, response) {
        request.token = (request.token ? request.token + token : request.token = token);
        response.writeHead(request.token);
        response.end();
    };
}

/**
 * Returns a middleware/handler that terminates the request with a response with the given status code.
 *
 * @param statusCode
 * @returns {Function} Middleware/Handler function
 */
function terminateWithStatusCode(statusCode) {
    return function (request, response) {
        response.writeHead(statusCode);
        response.end();
    }
}

/**
 * Returns a middleware/handler that terminates the request with an echo of the request parameters (variable components).
 *
 * @returns {Function} Middleware/Handler function
 */
function echoParamsHanlder() {
    return function (request, response) {
        var params = request.params;
        var result = {
            params: {}
        };

        for (var paramKey in params) {
            result.params[paramKey] = params[paramKey];
        }

        response.send(result);
    };
}

/**
 * A no-op middleware. Immediately calls next().
 *
 * @param request
 * @param response
 * @param next {function}
 */
function noopMiddleware(request, response, next) {
    next && next();
}
