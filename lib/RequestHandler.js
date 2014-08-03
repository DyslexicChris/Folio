var url = require('url');
var _ = require('underscore');

module.exports = RequestHandler;


/**
 *
 * @param routeManager
 * @param routeMiddlewareManager
 * @param routeHandlerManager
 * @constructor
 */
function RequestHandler(routeManager, routeMiddlewareManager, routeHandlerManager) {
    'use strict';

    this._routeManager = routeManager;
    this._routeMiddlewareManager = routeMiddlewareManager;
    this._routeHandlerManager = routeHandlerManager;
}

/**
 *
 * @param request
 * @param response
 */
RequestHandler.prototype.handle = function (request, response) {
    'use strict';

    var requestUrl = url.parse(request.url);
    request.path = requestUrl.pathname;
    request.query = requestUrl.query;

    var matchedRoute = this._routeManager.matchPath(request.method, request.path);

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

        response.statusCode = 404;
        response.end();
    }

};
