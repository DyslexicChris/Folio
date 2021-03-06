var RouteResolver = require('./RouteResolver');
var RouteFactory = require('./RouteFactory');
var RouteSpecificationParser = require('./RouteSpecificationParser');
var RouteRegistry = require('./registries/RouteRegistry');
var RouteMiddlewareRegistry = require('./registries/RouteMiddlewareRegistry');
var RouteHandlerRegistry = require('./registries/RouteHandlerRegistry');
var ObjectDecoratorFactory = require('./decorators/ObjectDecoratorFactory');
var ObjectDecorationFactory = require('./decorators/ObjectDecorationFactory');
var RouteCanister = require('./canisters/RouteCanister');
var MiddlewareCanister = require('./canisters/MiddlewareCanister');
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

    this.routeRegistry = new RouteRegistry();
    this.routeSpecificationParser = new RouteSpecificationParser();
    this.routeResolver = new RouteResolver(this.routeRegistry);
    this.routeFactory = new RouteFactory(this.routeSpecificationParser);
    this.routeMiddlewareRegistry = new RouteMiddlewareRegistry();
    this.routeHandlerRegistry = new RouteHandlerRegistry();
    this.objectDecorationFactory = new ObjectDecorationFactory();
    this.objectDecoratorFactory = new ObjectDecoratorFactory(this.objectDecorationFactory);
    this.requestDecorator = this.objectDecoratorFactory.requestDecorator();
    this.responseDecorator = this.objectDecoratorFactory.responseDecorator();
    this.requestHandler = new RequestHandler(this.routeResolver, this.routeMiddlewareRegistry, this.routeHandlerRegistry, this.requestDecorator, this.responseDecorator);
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

    var middlewareCanister = MiddlewareCanister.new(this.routeMiddlewareRegistry);

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

    return this._createRouteCanister(HTTPConstants.methods.GET, specification);
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

    return this._createRouteCanister(HTTPConstants.methods.POST, specification);
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

    return this._createRouteCanister(HTTPConstants.methods.PUT, specification);
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

    return this._createRouteCanister(HTTPConstants.methods.DELETE, specification);
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

    return this._createRouteCanister(HTTPConstants.methods.HEAD, specification);
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

    this.routeRegistry.reset();
    this.routeMiddlewareRegistry.reset();
    this.routeHandlerRegistry.reset();
};

/**
 *
 * @param method {String}
 * @param specification {String}
 * @returns {RouteCanister}
 * @private
 */
Folio.prototype._createRouteCanister = function (method, specification) {

    var route = this.routeFactory.buildRoute(method, specification);
    return RouteCanister.new(route, this.routeRegistry, this.routeMiddlewareRegistry, this.routeHandlerRegistry);
};