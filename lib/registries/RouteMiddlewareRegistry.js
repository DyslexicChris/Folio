var _ = require('underscore');

module.exports = RouteMiddlewareRegistry;

var INVALID_MIDDLEWARE_ERROR_MESSAGE = 'Middleware is not a function';
var GLOBAL_MIDDLEWARE_GROUP = 'global';

/**
 * @classdesc The RouteMiddlewareRegistry looks after middleware functions for routes.
 *
 * @example
 * var myRouteMiddlewareRegistry = new RouteMiddlewareRegistry();
 *
 * // Register middleware for a route
 * myRouteMiddlewareRegistry.addMiddlewareForRoute('GET', '/example/:varA/:varB' myMiddlewareA);
 * myRouteMiddlewareRegistry.addMiddlewareForRoute('GET', '/example/:varA/:varB' myMiddlewareB);
 *
 * // Retrieve middleware for a route
 * var registeredMiddleware = myRouteMiddlewareRegistry.getMiddlewareForRoute('GET', '/example/:varA/:varB');
 *
 * // registeredMiddleware will be
 * [myMiddlewareA, myMiddlewareB];
 *
 * @constructor
 */
function RouteMiddlewareRegistry() {
    'use strict';

    this._routeMiddleware = {

    };

    this._methodMiddleware = {

    };
}

/**
 * Add middleware that should be applied to to a specific route
 *
 * @param route {Route}
 * @param middleware {function} single middleware
 */
RouteMiddlewareRegistry.prototype.addMiddlewareForRoute = function (route, middleware) {
    'use strict';

    this._validateMiddleware(middleware);
    this._routeMiddleware[route.toString()] = (this._routeMiddleware[route.toString()] || []);
    this._routeMiddleware[route.toString()].push(middleware);
};


/**
 * Add middleware that should be applied to all routes with the given method
 *
 * @param method {String} e.g. 'GET'
 * @param middleware {function} single middleware
 */
RouteMiddlewareRegistry.prototype.addMiddlewareForMethod = function (method, middleware) {
    'use strict';

    this._addMiddleware(method, middleware);
};


/**
 * Add middleware that should be applied to all routes
 *
 * @param middleware {function} single middleware
 */
RouteMiddlewareRegistry.prototype.addGlobalMiddleware = function (middleware) {
    'use strict';

    this._addMiddleware(GLOBAL_MIDDLEWARE_GROUP, middleware);
};

/**
 * Return middleware that should be applied to to a specific route
 *
 * @param route {Route}
 * @returns {Array} An array of middleware
 */
RouteMiddlewareRegistry.prototype.getMiddlewareForRoute = function (route) {
    'use strict';

    return this._routeMiddleware[route.toString()] || [];
};

/**
 * Return middleware that should be applied to a specific method
 *
 * @param method {String} e.g. 'GET'
 * @returns {Array} An array of middleware
 */
RouteMiddlewareRegistry.prototype.getMiddlewareForMethod = function (method) {
    'use strict';

    method = this._normaliseKey(method);
    return this._methodMiddleware[method] || [];
};

/**
 * Return middleware that should be applied to all routes
 *
 * @returns {Array} An array of middleware
 */
RouteMiddlewareRegistry.prototype.getGlobalMiddleware = function () {
    'use strict';

    return this._methodMiddleware.global || [];

};

/**
 * Resets all route middleware
 */
RouteMiddlewareRegistry.prototype.reset = function () {
    'use strict';

    this._routeMiddleware = {};
    this._methodMiddleware = {};
};


/**
 * @param middlewareGroup {String}
 * @param middleware {function} single middleware
 * @private
 */
RouteMiddlewareRegistry.prototype._addMiddleware = function (middlewareGroup, middleware) {

    this._validateMiddleware(middleware);
    middlewareGroup = this._normaliseKey(middlewareGroup);
    this._methodMiddleware[middlewareGroup] = (this._methodMiddleware[middlewareGroup] || []);
    this._methodMiddleware[middlewareGroup].push(middleware);
};

/**
 * @param middleware {function} single middleware
 * @private
 */
RouteMiddlewareRegistry.prototype._validateMiddleware = function (middleware) {
    'use strict';

    if (!_.isFunction(middleware)) {
        throw new Error(INVALID_MIDDLEWARE_ERROR_MESSAGE);
    }
};

/**
 * @param key {String}
 * @returns {String}
 * @private
 */
RouteMiddlewareRegistry.prototype._normaliseKey = function (key) {
    'use strict';

    return key && key.toLowerCase();
};