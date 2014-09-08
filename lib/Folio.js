var RouteManager = require('./RouteManager');
var RouteMiddlewareManager = require('./RouteMiddlewareManager');
var RouteHandlerManager = require('./RouteHandlerManager');
var ResponseDecorator = require('./decorators/ResponseDecorator');
var RouteCanister = require('./RouteCanister');
var MiddlewareCanister = require('./MiddlewareCanister');
var HttpServer = require('./HttpServer');
var RequestHandler = require('./RequestHandler');
var ProcessManager = require('./ProcessManager');
var JSONBodyParserFactory = require('./middleware/JSONBodyParserFactory');

module.exports = Folio;

var HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    HEAD: 'HEAD'
};

/**
 * @classdesc The main interface to the framework. Provides a fluent javascript API for easily developing
 * HTTP based applications.
 *
 * @example
 * var myFolioApp = new Folio();
 *
 * myFolioApp.cluster(function(){
 *
 *     myFolioApp.get('/hello-world-path').handler(helloWorldHandler);
 *     myFolioApp.get('/withVars/:varA/:varB').handler(myOtherHandler);
 *     myFolioApp.post('/comments')
 *         .middleware(authMiddleware, myFolioApp.jsonBodyParser())
 *         .handler(commentsPostHandler);
 *
 *     myFolioApp.start(3000, function(){
 *         // App started and is listening for HTTP request on port 3000
 *     });
 *
 * });
 *
 * @constructor
 */
function Folio() {
    'use strict';

    this._routeManager = new RouteManager();
    this._routeMiddlewareManager = new RouteMiddlewareManager();
    this._routeHandlerManager = new RouteHandlerManager();
    this._responseDecorator = new ResponseDecorator();
    this._requestHandler = new RequestHandler(this._routeManager, this._routeMiddlewareManager, this._routeHandlerManager, this._responseDecorator);
    this._httpServer = new HttpServer(this._requestHandler);
    this._processManager = new ProcessManager();
    this._jsonBodyParserFactory = new JSONBodyParserFactory();
}

/**
 * @example
 * myFolioApp.use(middlewareA, middlewareB).forAllRoutes();
 *
 * @param arguments {} Middleware functions need to accept request, response and next - where next is a completion callback
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
 * @example
 * myFolioApp.get('/hello-world-path').handler(helloWorldHandler);
 *
 * @param specification {String} e.g. '/example/:varA'
 * @returns {RouteCanister}
 */
Folio.prototype.get = function (specification) {
    'use strict';

    return RouteCanister.new(HTTP_METHODS.GET, specification, this._routeManager, this._routeMiddlewareManager, this._routeHandlerManager);
};

/**
 * @example
 * myFolioApp.post('/hello-world-path').handler(helloWorldHandler);
 *
 * @param specification {String} e.g. '/example/:varA'
 * @returns {RouteCanister}
 */
Folio.prototype.post = function (specification) {
    'use strict';

    return RouteCanister.new(HTTP_METHODS.POST, specification, this._routeManager, this._routeMiddlewareManager, this._routeHandlerManager);
};

/**
 * @example
 * myFolioApp.put('/hello-world-path').handler(helloWorldHandler);
 *
 * @param specification {String} e.g. '/example/:varA'
 * @returns {RouteCanister}
 */
Folio.prototype.put = function (specification) {
    'use strict';

    return RouteCanister.new(HTTP_METHODS.PUT, specification, this._routeManager, this._routeMiddlewareManager, this._routeHandlerManager);
};

/**
 * @example
 * myFolioApp.delete('/hello-world-path').handler(helloWorldHandler);
 *
 * @param specification {String} e.g. '/example/:varA'
 * @returns {RouteCanister}
 */
Folio.prototype.delete = function (specification) {
    'use strict';

    return RouteCanister.new(HTTP_METHODS.DELETE, specification, this._routeManager, this._routeMiddlewareManager, this._routeHandlerManager);
};

/**
 * @example
 * myFolioApp.head('/hello-world-path').handler(helloWorldHandler);
 *
 * @param specification {String} e.g. '/example/:varA'
 * @returns {RouteCanister}
 */
Folio.prototype.head = function (specification) {
    'use strict';

    return RouteCanister.new(HTTP_METHODS.HEAD, specification, this._routeManager, this._routeMiddlewareManager, this._routeHandlerManager);
};

/**
 * Starts the HTTP server on the given port. The completedStartedCallback will be called when the HTTP server
 * is up and running.
 *
 * Delegates to its {@link HttpServer} object.
 *
 * @param port {integer} The port the HTTP server should listen on.
 * @param completedStartCallback {function} Will be called when the HTTP server has started.
 */
Folio.prototype.start = function (port, completedStartCallback) {
    'use strict';

    this._httpServer.start(port, completedStartCallback);
};


/**
 * @param completedStopCallback {function} Will be called when the HTTP server has been stopped
 */
Folio.prototype.stop = function(completedStopCallback) {
    'use strict';

    this._httpServer.stop(completedStopCallback);
};

/**
 * See {@link ProcessManager}
 * @param clusterFunction {function} See {@link ProcessManager}
 */
Folio.prototype.cluster = function (clusterFunction) {
    'use strict';

    this._processManager.cluster(clusterFunction);
};

/**
 * Resets the stateful internals of the folio instance.
 * This includes: route manager; route middleware manager; and route handler manager.
 */
Folio.prototype.reset = function(){
    'use strict';

    this._routeManager.reset();
    this._routeMiddlewareManager.reset();
    this._routeHandlerManager.reset();
};

/**
 * Returns a JSON Body Parser middleware function. Useful for parsing POST or PUT bodies.
 *
 * See {@link JSONBodyParserFactory}
 *
 * @returns {Function} The JSON Body Parser middleware function
 */
Folio.prototype.jsonBodyParser = function(){
    'use strict';

    return this._jsonBodyParserFactory.newMiddleware();
};