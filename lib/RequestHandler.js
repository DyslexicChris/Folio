var url = require('url');

module.exports = RequestHandler;

var ERROR_NOT_FOUND_STATUS = 404;
var ERROR_NOT_IMPLEMENTED = 501;

/**
 * @classdesc The RequestHandler handles all inbound requests to the application. It routes to the appropriate middleware
 * and handlers. If no route exists for the requested path, a 404 - Not Found response will be sent back to the client.
 *
 * @param routeManager {RouteManager}
 * @param routeMiddlewareManager {RouteMiddlewareManager}
 * @param responseDecorator {ResponseDecorator}
 * @param routeHandlerManager {RouteHandlerManager}
 * @constructor
 */
function RequestHandler(routeManager, routeMiddlewareManager, routeHandlerManager, responseDecorator) {
    'use strict';

    this._routeManager = routeManager;
    this._routeMiddlewareManager = routeMiddlewareManager;
    this._routeHandlerManager = routeHandlerManager;
    this._responseDecorator = responseDecorator;
}

/**
 * @param request {IncomingMessage}
 * @param response {ServerResponse}
 */
RequestHandler.prototype.handle = function (request, response) {
    'use strict';

    this._parseRequestURL(request);

    var matchedRoute = this._routeManager.query(request.method, request.path);

    if (matchedRoute) {

        var allMiddlewareForRoute = this._allMiddlewareApplicableToRoute(matchedRoute);
        var handler = this._routeHandlerManager.getHandlerForRoute(matchedRoute.method, matchedRoute.specification);

        this._decorateRequestResponse(request, response);
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

    var matchedRouteSpecification = route.specification;
    var globalMiddleware = this._routeMiddlewareManager.getGlobalMiddleware() || [];
    var globalMiddlewareForMethod = this._routeMiddlewareManager.getMiddlewareForMethod(route.method) || [];
    var routeSpecificMiddleware = this._routeMiddlewareManager.getMiddlewareForRoute(route.method, matchedRouteSpecification) || [];

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

    this._responseDecorator.decorate(response);
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

    this._endResponseWithStatusCode(response, ERROR_NOT_FOUND_STATUS);
};

/**
 * @param response {ServerResponse}
 * @private
 */
RequestHandler.prototype._sendNotImplementedResponse = function (response) {
    'use strict';

    this._endResponseWithStatusCode(response, ERROR_NOT_IMPLEMENTED);
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
