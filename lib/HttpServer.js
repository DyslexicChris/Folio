var HTTPConstants = require('./constants/HTTPConstants');
var domain = require('domain');
var http = require('http');
var Logger = require('./Logger');

module.exports = HttpServer;

var ERROR_EVENT_NAME = 'error';

/**
 * @classdesc Manages a standard node http server. Wraps incoming requests in node domains to catch
 * unhandled exceptions.
 *
 * @constructor
 * @param requestHandler {RequestHandler}
 */
function HttpServer(requestHandler) {
    'use strict';

    this._requestHandler = requestHandler;
}

/**
 * @param port {integer} The port the HTTP server should listen on
 * @param completedStartCallback {function} Will be called when the HTTP server has started
 */
HttpServer.prototype.start = function (port, completedStartCallback) {
    'use strict';

    this.server = http.createServer(function (request, response) {

        var requestDomain = domain.create();
        requestDomain.on(ERROR_EVENT_NAME, this._requestDomainErrorHandler.bind(this));
        requestDomain.add(request);
        requestDomain.add(response);
        requestDomain.add(this.server);

        requestDomain.run(function () {
            this._requestHandler.handle(request, response);
        }.bind(this));

    }.bind(this));

    this.server.listen(port, completedStartCallback);
};

/**
 * @param completedStopCallback {function} Will be called when the HTTP server has been stopped
 */
HttpServer.prototype.stop = function(completedStopCallback) {
    'use strict';

    this.server.close(function(){
        this.server = null;
        if(completedStopCallback){
            completedStopCallback();
        }
    }.bind(this));
};

/**
 * @param domainError {Error}
 * @private
 */
HttpServer.prototype._requestDomainErrorHandler = function (domainError) {
    'use strict';

    Logger.getLogger().error('Something went wrong: %s\n\n%s', domainError.message, domainError.stack);
    this._sendInternalServerError(domainError.domain.members[1]);
};

/**
 * @param response {ServerResponse}
 * @private
 */
HttpServer.prototype._sendInternalServerError = function (response) {
    'use strict';

    var headers = {
        'Connection': 'close'
    };

    try {
        response.writeHead(HTTPConstants.statusCodes.INTERNAL_ERROR, headers);
        response.end();
    } catch (responseError) {
        Logger.getLogger().error('Error while sending "500 Internal Server Error"', responseError.message);
    }
};
