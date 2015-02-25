var RouteManager = require('./RouteManager');
var RouteMiddlewareManager = require('./RouteMiddlewareManager');
var RouteHandlerManager = require('./RouteHandlerManager');
var ObjectDecoratorFactory = require('./decorators/ObjectDecoratorFactory');
var ObjectDecorationFactory = require('./decorators/ObjectDecorationFactory');
var RouteCanister = require('./RouteCanister');
var MiddlewareCanister = require('./MiddlewareCanister');
var HttpServer = require('./HttpServer');
var RequestHandler = require('./RequestHandler');
var CoreMiddlewareFactory = require('./middleware/CoreMiddlewareFactory');
var HTTPConstants = require('./constants/HTTPConstants');

module.exports = Folio;

/**
 * @classdesc The main interface to the framework. Provides a fluent javascript API for easily developing
 * HTTP based applications.
 *
 * @example
 * var myFolioApp = new Folio();
 *
 * myFolioApp.get('/hello-world-path').handler(helloWorldHandler);
 * myFolioApp.get('/withVars/:varA/:varB').handler(myOtherHandler);
 * myFolioApp.post('/comments')
 *     .middleware(authMiddleware, myFolioApp.middlewareFactory.jsonBodyParser())
 *     .handler(commentsPostHandler);
 *
 * myFolioApp.start(3000, function(){
 *     // App started and is listening for HTTP request on port 3000
 * });
 *
 * @constructor
 */
function Folio() {
    'use strict';

    this.routeManager = new RouteManager();
    this.routeMiddlewareManager = new RouteMiddlewareManager();
    this.routeHandlerManager = new RouteHandlerManager();
    this.objectDecorationFactory = new ObjectDecorationFactory();
    this.objectDecoratorFactory = new ObjectDecoratorFactory(this.objectDecorationFactory);
    this.requestDecorator = this.objectDecoratorFactory.requestDecorator();
    this.responseDecorator = this.objectDecoratorFactory.responseDecorator();
    this.requestHandler = new RequestHandler(this.routeManager, this.routeMiddlewareManager, this.routeHandlerManager, this.requestDecorator, this.responseDecorator);
    this.httpServer = new HttpServer(this.requestHandler);
    this.middlewareFactory = new CoreMiddlewareFactory();
}

/**
 *
 * @param renderEngine
 */
Folio.prototype.setRenderEngine = function (renderEngine) {
    'use strict';

    if (this._renderEngine) {
        throw new Error('Render engine already set');
    }

    this._renderEngine = renderEngine;
    this._renderViewDecoration = this.objectDecorationFactory.renderViewDecoration(renderEngine);
    this.responseDecorator.addDecoration(this._renderViewDecoration);
};

/**
 *
 * @returns {*}
 */
Folio.prototype.getRenderEngine = function () {
    'use strict';

    return this._renderEngine;
};

/**
 * @example
 * myFolioApp.use(middlewareA, middlewareB).forAllRoutes();
 *
 * @param arguments {} Middleware functions need to accept request, response and next - where next is a completion callback
 * @returns {MiddlewareCanister}
 */
Folio.prototype.use = function () {
    'use strict';

    var middlewareCanister = MiddlewareCanister.new(this.routeMiddlewareManager);

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

    return RouteCanister.new(HTTPConstants.methods.GET, specification, this.routeManager, this.routeMiddlewareManager, this.routeHandlerManager);
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

    return RouteCanister.new(HTTPConstants.methods.POST, specification, this.routeManager, this.routeMiddlewareManager, this.routeHandlerManager);
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

    return RouteCanister.new(HTTPConstants.methods.PUT, specification, this.routeManager, this.routeMiddlewareManager, this.routeHandlerManager);
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

    return RouteCanister.new(HTTPConstants.methods.DELETE, specification, this.routeManager, this.routeMiddlewareManager, this.routeHandlerManager);
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

    return RouteCanister.new(HTTPConstants.methods.HEAD, specification, this.routeManager, this.routeMiddlewareManager, this.routeHandlerManager);
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

    this.httpServer.start(port, completedStartCallback);
};


/**
 * @param completedStopCallback {function} Will be called when the HTTP server has been stopped
 */
Folio.prototype.stop = function (completedStopCallback) {
    'use strict';

    this.httpServer.stop(completedStopCallback);
};

/**
 * Resets the stateful internals of the folio instance.
 * This includes: route manager; route middleware manager; and route handler manager.
 */
Folio.prototype.reset = function () {
    'use strict';

    this.routeManager.reset();
    this.routeMiddlewareManager.reset();
    this.routeHandlerManager.reset();
};
