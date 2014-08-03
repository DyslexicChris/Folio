var domain = require('domain');
var http = require('http');
var Logger = require('./Logger');

module.exports = HttpServer;

/**
 *
 * @constructor
 * @param requestHandler
 */
function HttpServer(requestHandler) {
    'use strict';

    this._requestHandler = requestHandler;
}

/**
 *
 * @param port
 */
HttpServer.prototype.start = function (port) {
    'use strict';

    var thisHttpServer = this;

    thisHttpServer.server = http.createServer(function (request, response) {

        var requestDomain = domain.create();
        requestDomain.on('error', thisHttpServer._requestDomainErrorHandler);
        requestDomain.add(request);
        requestDomain.add(response);
        requestDomain.add(thisHttpServer.server);

        requestDomain.run(function () {

            thisHttpServer._requestHandler.handle(request, response);

        });

    });

    thisHttpServer.server.listen(port, function () {
        Logger.log('Started http server on port %s', port);
    });


};


/**
 *
 * @param domainError
 * @private
 */
HttpServer.prototype._requestDomainErrorHandler = function (domainError) {
    'use strict';

    Logger.error('Something went wrong: %s\n\n%s', domainError.message, domainError.stack);
    HttpServer.prototype._gracefullyShutdownWorker(domainError.domain.members[2]);
    HttpServer.prototype._sendInternalServerError(domainError.domain.members[1]);

};

/**
 *
 * @param server
 * @private
 */
HttpServer.prototype._gracefullyShutdownWorker = function (server) {
    'use strict';

    try {
        Logger.log('Gracefully shutting down http server');
        server.close(function () {
            Logger.log('http server has shutdown');
            process.exit();
        });

    } catch (shutdownError) {
        Logger.warn('Error while shutting down http server: %s', shutdownError.message);
    }
};

/**
 *
 * @param response
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
        Logger.error('Error while sending "500 Internal Server Error"', responseError.message);
    }
};
