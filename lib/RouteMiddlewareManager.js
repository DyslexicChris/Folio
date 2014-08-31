var _ = require('underscore');

module.exports = RouteMiddlewareManager;

var INVALID_MIDDLEWARE_ERROR_MESSAGE = 'Middleware is not a function';

/**
 * @classdesc The RouteMiddlewareManager looks after middleware functions for routes.
 *
 * @example
 * var myRouteMiddlewareManager = new RouteMiddlewareManager();
 *
 * // Register middleware for a route
 * myRouteMiddlewareManager.addMiddlewareForRoute('GET', '/example/:varA/:varB' myMiddlewareA);
 * myRouteMiddlewareManager.addMiddlewareForRoute('GET', '/example/:varA/:varB' myMiddlewareB);
 *
 * // Retrieve middleware for a route
 * var registeredMiddleware = myRouteMiddlewareManager.getMiddlewareForRoute('GET', '/example/:varA/:varB');
 *
 * // registeredMiddleware will be
 * [myMiddlewareA, myMiddlewareB];
 *
 * @constructor
 */
function RouteMiddlewareManager() {
    'use strict';

    this._routeMiddleware = {

    };

    this._methodMiddleware = {

    };
}

/**
 * Add middleware that should be applied to to a specific route
 *
 * @param method {String} e.g. 'GET'
 * @param specification {String} e.g. '/example/:varA'
 * @param middleware {function} single middleware
 */
RouteMiddlewareManager.prototype.addMiddlewareForRoute = function (method, specification, middleware) {
    'use strict';

    this._validateMiddleware(middleware);
    this._routeMiddleware[method] = (this._routeMiddleware[method] || {});
    this._routeMiddleware[method][specification] = (this._routeMiddleware[method][specification] || []);
    this._routeMiddleware[method][specification].push(middleware);

};


/**
 * Add middleware that should be applied to all routes with the given method
 *
 * @param method {String} e.g. 'GET'
 * @param middleware {function} single middleware
 */
RouteMiddlewareManager.prototype.addMiddlewareForMethod = function (method, middleware) {
    'use strict';

    this._addMiddleware(method, middleware);
};


/**
 * Add middleware that should be applied to all routes
 *
 * @param middleware {function} single middleware
 */
RouteMiddlewareManager.prototype.addGlobalMiddleware = function (middleware) {
    'use strict';

    this._addMiddleware('global', middleware);

};

/**
 * Return middleware that should be applied to to a specific route
 *
 * @param method {String} e.g. 'GET'
 * @param specification {String} e.g. '/example/:varA'
 * @returns {Array} An array of middleware
 */
RouteMiddlewareManager.prototype.getMiddlewareForRoute = function (method, specification) {
    'use strict';

    return this._routeMiddleware[method] && this._routeMiddleware[method][specification] || [];

};

/**
 * Return middleware that should be applied to a specific method
 *
 * @param method {String} e.g. 'GET'
 * @returns {Array} An array of middleware
 */
RouteMiddlewareManager.prototype.getMiddlewareForMethod = function (method) {
    'use strict';

    return this._methodMiddleware[method] || [];
};

/**
 * Return middleware that should be applied to all routes
 *
 * @returns {Array} An array of middleware
 */
RouteMiddlewareManager.prototype.getGlobalMiddleware = function () {
    'use strict';

    return this._methodMiddleware.global || [];

};

/**
 * Resets all route middleware
 */
RouteMiddlewareManager.prototype.reset = function () {
    'use strict';

    this._routeMiddleware = {};
    this._methodMiddleware = {};
};


/**
 * @param middlewareGroup {String}
 * @param middleware {function} single middleware
 * @private
 */
RouteMiddlewareManager.prototype._addMiddleware = function (middlewareGroup, middleware) {

    this._validateMiddleware(middleware);
    this._methodMiddleware[middlewareGroup] = (this._methodMiddleware[middlewareGroup] || []);
    this._methodMiddleware[middlewareGroup].push(middleware);

};

/**
 * @param middleware {function} single middleware
 * @private
 */
RouteMiddlewareManager.prototype._validateMiddleware = function (middleware) {
    'use strict';

    if (!_.isFunction(middleware)) {
        throw new Error(INVALID_MIDDLEWARE_ERROR_MESSAGE);
    }
};