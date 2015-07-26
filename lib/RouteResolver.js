var GuildCache = require('guild');
var _ = require('underscore');

module.exports = RouteResolver;

var ROUTE_RESOLVE_CACHE_SIZE = 1000;

/**
 *
 * @param routeRegistry {RouteRegistry}
 * @constructor
 */
function RouteResolver(routeRegistry) {
    'use strict';

    this._routeRegistry = routeRegistry;
    this._routeMapCache = GuildCache.cacheWithSize(ROUTE_RESOLVE_CACHE_SIZE);
}

/**
 *
 * @param method {String}
 * @param path {String}
 * @returns {Route}
 */
RouteResolver.prototype.query = function (method, path) {
    'use strict';

    return this._lookupCachedRouteForMethodAndPath(method, path) ||
        this._matchRouteByTestingSpecifications(method, path);
};

/**
 *
 * @param route {Route}
 * @param path {String}
 * @returns {Object}
 */
RouteResolver.prototype.parseParameters = function (route, path) {
    'use strict';

    var params = {};

    var routeBreakdown = route.getRegex().exec(path);

    if (routeBreakdown) {

        routeBreakdown.splice(0, 1);

        delete routeBreakdown.index;
        delete routeBreakdown.input;

        if (routeBreakdown.length === route.getVariableComponents().length) {

            _.each(route.getVariableComponents(), function (variableComponent, index) {
                params[variableComponent] = routeBreakdown[index];
            });
        }
    }


    return params;
};

/**
 * Resets the route mapping cache.
 */
RouteResolver.prototype.clearRouteMapCache = function () {
    'use strict';

    this._routeMapCache.reset();
};

/**
 * @param method {String}
 * @param path {String}
 * @returns {Route}
 * @private
 */
RouteResolver.prototype._matchRouteByTestingSpecifications = function (method, path) {
    'use strict';

    var routes = this._routeRegistry.routes();
    var matchedRoute;

    for (var routeCount = 0; (routeCount < routes.length && !matchedRoute); routeCount += 1) {

        var currentRoute = routes[routeCount];
        var routeFound = (method.toLowerCase() === currentRoute.getMethod()) && currentRoute.getRegex().test(path);

        if (routeFound) {
            matchedRoute = currentRoute;
            this._cacheRouteForMethodAndPath(method, path, matchedRoute);
        }
    }

    return matchedRoute;
};

/**
 * @param method {String}
 * @param path {String}
 * @returns {Route}
 * @private
 */
RouteResolver.prototype._lookupCachedRouteForMethodAndPath = function (method, path) {
    'use strict';

    return this._routeMapCache.get(this._routeMapCacheKeyForMethodAndPath(method, path));
};

/**
 * @param method {String}
 * @param path {String}
 * @param route {Route}
 * @private
 */
RouteResolver.prototype._cacheRouteForMethodAndPath = function (method, path, route) {
    'use strict';

    this._routeMapCache.put(this._routeMapCacheKeyForMethodAndPath(method, path), route);
};

/**
 * @param method {String}
 * @param path {String}
 * @returns {String}
 * @private
 */
RouteResolver.prototype._routeMapCacheKeyForMethodAndPath = function (method, path) {
    'use strict';

    return (method.toLowerCase() + path);
};
