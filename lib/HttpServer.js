var domain = require('domain');
var http = require('http');
var Logger = require('./Logger');

module.exports = HttpServer;

var ERROR_EVENT_NAME = 'error';

/**
 * @classdesc Manages a standard node http server. Wraps incoming requests in node domains to catch
 * unhandled exceptions by gracefully shutting down the http server and exiting the process.
 * The {@link ProcessManager} will handle the process exit by forking a new process in its place.
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

    var thisHttpServer = this;

    this.server = http.createServer(function (request, response) {

        var requestDomain = domain.create();
        requestDomain.on(ERROR_EVENT_NAME, thisHttpServer._requestDomainErrorHandler);
        requestDomain.add(request);
        requestDomain.add(response);
        requestDomain.add(thisHttpServer.server);

        requestDomain.run(function () {

            thisHttpServer._requestHandler.handle(request, response);

        });

    });

    thisHttpServer.server.listen(port, completedStartCallback);
};

/**
 * @param completedStopCallback {function} Will be called when the HTTP server has been stopped
 */
HttpServer.prototype.stop = function(completedStopCallback) {
    'use strict';

    var thisHttpServer = this;
    this.server.close(function(){
        thisHttpServer.server = null;
        if(completedStopCallback){
            completedStopCallback();
        }
    });
};

/**
 * @param domainError {Error}
 * @private
 */
HttpServer.prototype._requestDomainErrorHandler = function (domainError) {
    'use strict';

    Logger.getLogger().error('Something went wrong: %s\n\n%s', domainError.message, domainError.stack);
    HttpServer.prototype._sendInternalServerError(domainError.domain.members[1]);
    HttpServer.prototype._gracefullyShutdownWorker(domainError.domain.members[2]);
};

/**
 * @param server {Server}
 * @private
 */
HttpServer.prototype._gracefullyShutdownWorker = function (server) {
    'use strict';

    try {
        Logger.getLogger().log('Gracefully shutting down http server');
        server.close(function () {
            Logger.getLogger().log('http server has shutdown');
            process.exit();
        });

    } catch (shutdownError) {
        Logger.getLogger().warn('Error while shutting down http server: %s', shutdownError.message);
    }
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
        response.writeHead(500, headers);
        response.end();
    } catch (responseError) {
        Logger.getLogger().error('Error while sending "500 Internal Server Error"', responseError.message);
    }
};
