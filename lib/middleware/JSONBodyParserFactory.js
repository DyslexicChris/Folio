module.exports = JSONBodyParserFactory;

var DEFAULT_MAX_REQUEST_BODY_SIZE_MB = 4;
var HTTP_ERROR_CODE_REQUEST_TOO_LARGE = 413;
var REQUEST_DATA_EVENT = 'data';
var REQUEST_END_EVENT = 'end';

/**
 * @classdesc The JSON Body Parser Factory creates JSON Body Parser middleware functions.
 *
 * A JSON body parser middleware function does what it says on the tin. It parses JSON from the request body. This
 * is useful when dealing with POST and PUT JSON bodies, but is not limited to any particular HTTP methods.
 *
 * The parsed JSON object will be attached to the request object in a property called 'body', e.g. 'request.body'. If
 * there was a problem parsing the JSON, a boolean property will be set on the request called 'badJSON', e.g.
 * 'request.badJSON'.
 *
 * If the request body is greater than the maximum allowed body size, the client will be sent a 413 - 'Request Too Large'
 * HTTP response. If this happens, the next middleware / handler will not be called.
 *
 * @param maxBodySize {number} Max body size in MB to configure the middleware produced from the factory with.
 * This imposes a limit on the amount of data that the server will handle per request. If a value is not provided
 * during construction, a value of 4MB will be used. Note that the request body data is held in memory until parsed -
 * bear this in mind when deciding a max body size.
 *
 * @constructor
 */
function JSONBodyParserFactory(maxBodySize) {
    'use strict';

    this._maxBodySize = this._maxBodySizeBytes(maxBodySize);
}

/**
 * Returns a JSON Body Parser middleware function configured with the max body size for the factory.
 *
 * @returns {Function} The middleware function
 */
JSONBodyParserFactory.prototype.newMiddleware = function(){
    'use strict';

    var maxBodySizeBytes = this._maxBodySize;
    var handleTooLargeRequest = this._handleTooLargeRequest;
    var parseCompletedBodyWithRequest = this._parseCompletedBodyWithRequest;


    /**
     * @param request {IncomingMessage} HTTP request object
     * @param response {ServerResponse} HTTP response object
     * @param next {function} The continuation callback function. Providing there are no problems, next will be called
     * when the middleware has done its job.
     */
    function middlewareFunction(request, response, next){

        var requestBody = '';
        var currentBodySize = 0;
        var requestAborted = false;

        request.on(REQUEST_DATA_EVENT, function(chunk){

            if(currentBodySize > maxBodySizeBytes){
                handleTooLargeRequest(request, response);
                requestAborted = true;
            } else {
                requestBody = requestBody + chunk;
                currentBodySize = currentBodySize + chunk.length;
            }
        });

        request.on(REQUEST_END_EVENT, function(){
            if(!requestAborted){
                parseCompletedBodyWithRequest(requestBody, request);
                requestBody = null;
                currentBodySize = null;
                next();
            }
        });
    }

    return middlewareFunction;
};

/**
 * @param mbValue {number}
 * @returns {number}
 * @private
 */
JSONBodyParserFactory.prototype._maxBodySizeBytes = function(mbValue){
    'use strict';

    return (mbValue || DEFAULT_MAX_REQUEST_BODY_SIZE_MB) * (1024 * 1024);
};

/**
 * @param request {IncomingMessage}
 * @param response {ServerResponse}
 * @private
 */
JSONBodyParserFactory.prototype._handleTooLargeRequest = function(request, response){
    'use strict';

    response.statusCode = HTTP_ERROR_CODE_REQUEST_TOO_LARGE;
    response.end();
    request.connection.destroy();
};

/**
 * @param body {string}
 * @param request {IncomingMessage}
 * @private
 */
JSONBodyParserFactory.prototype._parseCompletedBodyWithRequest = function(body, request){
    'use strict';

    try {
        if(body) {
            request.body = JSON.parse(body);
        }
    } catch (exception) {
        request.badJSON = true;
    }
};