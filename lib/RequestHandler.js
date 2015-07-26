var url = require('url');
var HTTPConstants = require('./constants/HTTPConstants');

module.exports = RequestHandler;

/**
 * @classdesc The RequestHandler handles all inbound requests to the application. It routes to the appropriate middleware
 * and handlers. If no route exists for the requested path, a 404 - Not Found response will be sent back to the client.
 *
 * @param routeResolver {RouteResolver}
 * @param routeMiddlewareRegistry {RouteMiddlewareRegistry}
 * @param routeHandlerRegistry {RouteHandlerRegistry}
 * @param requestDecorator {ObjectDecorator}
 * @param responseDecorator {ObjectDecorator}
 * @constructor
 */
function RequestHandler(routeResolver, routeMiddlewareRegistry, routeHandlerRegistry, requestDecorator, responseDecorator) {
    'use strict';

    this._routeResolver = routeResolver;
    this._routeMiddlewareRegistry = routeMiddlewareRegistry;
    this._routeHandlerRegistry = routeHandlerRegistry;
    this._requestDecorator = requestDecorator;
    this._responseDecorator = responseDecorator;
}

/**
 * @param request {IncomingMessage}
 * @param response {ServerResponse}
 */
RequestHandler.prototype.handle = function (request, response) {
    'use strict';

    this._parseRequestURL(request);

    var matchedRoute = this._routeResolver.query(request.method, request.path);

    if (matchedRoute) {

        var allMiddlewareForRoute = this._allMiddlewareApplicableToRoute(matchedRoute);
        var handler = this._routeHandlerRegistry.getHandlerForRoute(matchedRoute);

        this._decorateRequestResponse(request, response);
        this._attachRouteParameters(matchedRoute, request);
        this._executeMiddlewareAndHandler(request, response, allMiddlewareForRoute, handler);

    } else {

        this._sendNotFoundResponse(response);
    }

};

/**
 * @param route {Route}
 * @returns {Array}
 * @private
 */
RequestHandler.prototype._allMiddlewareApplicableToRoute = function (route) {
    'use strict';

    var globalMiddleware = this._routeMiddlewareRegistry.getGlobalMiddleware() || [];
    var globalMiddlewareForMethod = this._routeMiddlewareRegistry.getMiddlewareForMethod(route.method) || [];
    var routeSpecificMiddleware = this._routeMiddlewareRegistry.getMiddlewareForRoute(route) || [];

    return [].concat(globalMiddleware).concat(globalMiddlewareForMethod).concat(routeSpecificMiddleware);
};

/**
 * @param request {IncomingMessage}
 * @private
 */
RequestHandler.prototype._parseRequestURL = function (request) {
    'use strict';

    var requestUrl = url.parse(request.url);
    request.path = requestUrl.pathname;
    request.query = requestUrl.query;
};

/**
 * @param request {IncomingMessage}
 * @param response {ServerResponse}
 * @private
 */
RequestHandler.prototype._decorateRequestResponse = function (request, response) {
    'use strict';

    this._requestDecorator.decorate(request);
    this._responseDecorator.decorate(response);
};

/**
 * @param route {Route}
 * @param request {IncomingMessage}
 * @private
 */
RequestHandler.prototype._attachRouteParameters = function (route, request) {
    'use strict';

    request.params = this._routeResolver.parseParameters(route, request.path);
};

/**
 * @param request {IncomingMessage}
 * @param response {ServerResponse}
 * @param allMiddlewareForRoute {Array}
 * @param handler {Function}
 * @private
 */
RequestHandler.prototype._executeMiddlewareAndHandler = function (request, response, allMiddlewareForRoute, handler) {
    'use strict';

    var thisRequestHandler = this;
    var executeMiddlewareAndHandler = function () {
        if (allMiddlewareForRoute.length) {
            var nextMiddleware = allMiddlewareForRoute.shift();
            if (nextMiddleware) {
                nextMiddleware(request, response, executeMiddlewareAndHandler);
            }
        } else if (handler) {
            handler(request, response);
        } else {
            thisRequestHandler._sendNotImplementedResponse(response);
        }
    };

    executeMiddlewareAndHandler();
};

/**
 * @param response {ServerResponse}
 * @private
 */
RequestHandler.prototype._sendNotFoundResponse = function (response) {
    'use strict';

    this._endResponseWithStatusCode(response, HTTPConstants.statusCodes.NOT_FOUND);
};

/**
 * @param response {ServerResponse}
 * @private
 */
RequestHandler.prototype._sendNotImplementedResponse = function (response) {
    'use strict';

    this._endResponseWithStatusCode(response, HTTPConstants.statusCodes.NOT_IMPLEMENTED);
};

/**
 * @param response {ServerResponse}
 * @param statusCode {Integer}
 * @private
 */
RequestHandler.prototype._endResponseWithStatusCode = function (response, statusCode) {
    'use strict';

    response.statusCode = statusCode;
    response.end();
};
