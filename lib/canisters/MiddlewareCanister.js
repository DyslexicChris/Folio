var _ = require('underscore');
var HTTPConstants = require('./../constants/HTTPConstants');

module.exports = MiddlewareCanister;

/**
 * MiddlewareCanister Constructor
 *
 * @classdesc Middleware canisters sit in front of the route middleware manager, and allow a middleware
 * or set of middleware to be registered with the route middleware manager using a fluent API.
 *
 * @param routeMiddlewareRegistry {RouteMiddlewareRegistry}
 * @constructor
 */
function MiddlewareCanister(routeMiddlewareRegistry) {
    'use strict';

    this._middleware = [];
    this._routeMiddlewareRegistry = routeMiddlewareRegistry;
}


/**
 * @param routeMiddlewareRegistry {RouteMiddlewareRegistry}
 * @returns {MiddlewareCanister}
 */
MiddlewareCanister.new = function (routeMiddlewareRegistry) {
    'use strict';

    return new MiddlewareCanister(routeMiddlewareRegistry);
};

/**
 * @returns {Array}
 */
MiddlewareCanister.prototype.middleware = function () {
    'use strict';

    return this._middleware;
};

/**
 * Adds a middleware or multiple middleware (multiple arguments) to the canister. Calling this method
 * has no side-effect until one of the terminating methods in this fluent api is called. Returns this
 * middleware canister.
 *
 * @example
 * myMiddlewareCanister.addMiddleware(middlewareA, middlewareB).forAllRoutes();
 *
 * @param arguments One or more middleware functions
 * @returns {MiddlewareCanister}
 */
MiddlewareCanister.prototype.addMiddleware = function () {
    'use strict';

    if (arguments.length) {
        _.each(arguments, function (middleware) {
            this._addSingleMiddleware(middleware);
        }, this);
    } else {
        throw new Error('Middleware is null');
    }

    return this;
};

/**
 * @param middleware {function}
 * @private
 */
MiddlewareCanister.prototype._addSingleMiddleware = function (middleware) {
    'use strict';

    if (_.isFunction(middleware)) {
        this._middleware.push(middleware);
    } else if (middleware) {
        throw new Error('Middleware is not a function');
    } else {
        throw new Error('Middleware is null');
    }
};


/**
 * Terminating method for adding the canister's set of middleware to the route middleware
 * manager for specific routes.
 *
 * @param route {Route}
 */
MiddlewareCanister.prototype.forRoute = function (route) {
    'use strict';

    _.each(this._middleware, function (middleware) {
        this._routeMiddlewareRegistry.addMiddlewareForRoute(route, middleware);
    }, this);

};

/**
 * Terminating method for adding the canister's set of middleware to the route middleware
 * manager for all routes.
 */
MiddlewareCanister.prototype.forAllRoutes = function () {
    'use strict';

    _.each(this._middleware, function (middleware) {
        this._routeMiddlewareRegistry.addGlobalMiddleware(middleware);
    }, this);

};

/**
 * Terminating method for adding the canister's set of middleware to the route middleware
 * manager for all GET method routes.
 */
MiddlewareCanister.prototype.forAllGets = function () {
    'use strict';

    this._addMiddlewareForMethod(this._middleware, HTTPConstants.methods.GET);

};

/**
 * Terminating method for adding the canister's set of middleware to the route middleware
 * manager for all POST method routes.
 */
MiddlewareCanister.prototype.forAllPosts = function () {
    'use strict';

    this._addMiddlewareForMethod(this._middleware, HTTPConstants.methods.POST);

};

/**
 * Terminating method for adding the canister's set of middleware to the route middleware
 * manager for all PUT method routes.
 */
MiddlewareCanister.prototype.forAllPuts = function () {
    'use strict';

    this._addMiddlewareForMethod(this._middleware, HTTPConstants.methods.PUT);

};

/**
 * Terminating method for adding the canister's set of middleware to the route middleware
 * manager for all DELETE method routes.
 */
MiddlewareCanister.prototype.forAllDeletes = function () {
    'use strict';

    this._addMiddlewareForMethod(this._middleware, HTTPConstants.methods.DELETE);

};

/**
 * Internal method for adding the canister's set of middleware to the route middleware
 * manager for specific routes.
 *
 * @param middlewares {array}
 * @param method {string}
 * @private
 */
MiddlewareCanister.prototype._addMiddlewareForMethod = function (middlewares, method) {

    _.each(middlewares, function (middleware) {
        this._routeMiddlewareRegistry.addMiddlewareForMethod(method, middleware);
    }, this);

};
