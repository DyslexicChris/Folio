var RouteManager = require('./RouteManager');
var RouteMiddlewareManager = require('./RouteMiddlewareManager');
var RouteHandlerManager = require('./RouteHandlerManager');
var RouteCanister = require('./RouteCanister');
var MiddlewareCanister = require('./MiddlewareCanister');
var HttpServer = require('./HttpServer');
var RequestHandler = require('./RequestHandler');
var ProcessManager = require('./ProcessManager');

module.exports = Folio;

var METHODS = {
    GET: 'GET'
};


/**
 *
 * @constructor
 */
function Folio() {
    'use strict';

    this._routeManager = new RouteManager();
    this._routeMiddlewareManager = new RouteMiddlewareManager();
    this._routeHandlerManager = new RouteHandlerManager();
    this._requestHandler = new RequestHandler(this._routeManager, this._routeMiddlewareManager, this._routeHandlerManager);
    this._httpServer = new HttpServer(this._requestHandler);
    this._processManager = new ProcessManager();
}

/**
 *
 * @returns {MiddlewareCanister}
 */
Folio.prototype.use = function () {
    'use strict';

    var middlewareCanister = MiddlewareCanister.new(this._routeMiddlewareManager);

    if (arguments.length) {
        middlewareCanister.addMiddleware.apply(middlewareCanister, arguments);
    } else {
        throw new Error('No middleware supplied');
    }

    return middlewareCanister;
};


/**
 *
 * @param specification
 * @returns {RouteCanister}
 */
Folio.prototype.get = function (specification) {
    'use strict';

    return RouteCanister.new(METHODS.GET, specification, this._routeManager, this._routeMiddlewareManager, this._routeHandlerManager);
};

/**
 *
 * @param port
 */
Folio.prototype.start = function (port) {
    'use strict';

    this._httpServer.start(port);
};

/**
 *
 * @param clusterizedFunction
 */
Folio.prototype.clusterize = function (clusterizedFunction) {
    'use strict';

    this._processManager.clusterize(clusterizedFunction);
};