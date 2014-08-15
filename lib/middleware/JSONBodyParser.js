module.exports = JSONBodyParser;

var DEFAULT_MAX_REQUEST_BODY_SIZE_MB = 4;
var HTTP_ERROR_CODE_REQUEST_TOO_LARGE = 413;

/**
 *
 * @constructor
 */
function JSONBodyParser(maxBodySizeMB) {
    'use strict';

    this.maxBodySize = this._maxBodySizeBytes(maxBodySizeMB);
}

/**
 *
 * @param request
 * @param response
 * @param next
 */
JSONBodyParser.prototype.parseJSONBody = function(request, response, next){
    'use strict';

    var requestBody = '';
    var currentBodySize = 0;
    var thisJSONBodyParser = this;
    var requestAborted = false;

    request.on('data', function(chunk){

        if(currentBodySize > thisJSONBodyParser.maxBodySize){
            thisJSONBodyParser._handleTooLargeRequest(request, response);
            requestAborted = true;
        } else {
            requestBody = requestBody + chunk;
            currentBodySize = currentBodySize + Buffer.byteLength(chunk, 'utf8');
        }
    });

    request.on('end', function(){
        if(!requestAborted){
            thisJSONBodyParser._parseCompletedBodyWithRequest(requestBody, request);
            next();
        }
    });

};

/**
 *
 * @param mbValue
 * @returns {number}
 * @private
 */
JSONBodyParser.prototype._maxBodySizeBytes = function(mbValue){
    'use strict';

    return (mbValue || DEFAULT_MAX_REQUEST_BODY_SIZE_MB) * (1024 * 1024);
};

/**
 *
 * @param request
 * @param response
 * @private
 */
JSONBodyParser.prototype._handleTooLargeRequest = function(request, response){
    'use strict';

    response.statusCode = HTTP_ERROR_CODE_REQUEST_TOO_LARGE;
    response.end();
    request.connection.destroy();
};

/**
 *
 * @param body
 * @param request
 * @private
 */
JSONBodyParser.prototype._parseCompletedBodyWithRequest = function(body, request){
    'use strict';

    try {
        if(body) {
            request.body = JSON.parse(body);
        }
    } catch (exception) {
        request.badJSON = true;
    }
};