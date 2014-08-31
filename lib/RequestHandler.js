var url = require('url');

module.exports = RequestHandler;

var ERROR_NOT_FOUND_STATUS = 404;

/**
 * @classdesc The RequestHandler handles all inbound requests to the application. It routes to the appropriate middleware
 * and handlers. If no route exists for the requested path, a 404 - Not Found response will be sent back to the client.
 *
 * @param routeManager {RouteManager}
 * @param routeMiddlewareManager {RouteMiddlewareManager}
 * @param routeHandlerManager {RouteHandlerManager}
 * @constructor
 */
function RequestHandler(routeManager, routeMiddlewareManager, routeHandlerManager) {
    'use strict';

    this._routeManager = routeManager;
    this._routeMiddlewareManager = routeMiddlewareManager;
    this._routeHandlerManager = routeHandlerManager;
}

/**
 * @param request {IncomingMessage}
 * @param response {ServerResponse}
 */
RequestHandler.prototype.handle = function (request, response) {
    'use strict';

    var requestUrl = url.parse(request.url);
    request.path = requestUrl.pathname;
    request.query = requestUrl.query;

    var matchedRoute = this._routeManager.query(request.method, request.path);

    if (matchedRoute) {

        var matchedRouteSpecification = matchedRoute.specification;
        var globalMiddleware = this._routeMiddlewareManager.getGlobalMiddleware();
        var globalMiddlewareForMethod = this._routeMiddlewareManager.getMiddlewareForMethod(request.method);
        var routeSpecificMiddleware = this._routeMiddlewareManager.getMiddlewareForRoute(request.method, matchedRouteSpecification);
        var allMiddlewareForRoute = [].concat(globalMiddleware || []).concat(globalMiddlewareForMethod || []).concat(routeSpecificMiddleware || []);
        var handler = this._routeHandlerManager.getHandlerForRoute(request.method, matchedRouteSpecification);

        var executeMiddlewareAndHandler = function () {
            if (allMiddlewareForRoute.length) {
                var nextMiddleware = allMiddlewareForRoute.shift();
                nextMiddleware(request, response, executeMiddlewareAndHandler);
            } else {
                handler(request, response);
            }
        };

        executeMiddlewareAndHandler();

    } else {

        response.statusCode = ERROR_NOT_FOUND_STATUS;
        response.end();
    }

};
