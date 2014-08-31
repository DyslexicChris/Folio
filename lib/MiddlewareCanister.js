var _ = require('underscore');

module.exports = MiddlewareCanister;

/**
 * MiddlewareCanister Constructor
 *
 * @classdesc Middleware canisters sit in front of the route middleware manager, and allow a middleware
 * or set of middleware to be registered with the route middleware manager using a fluent API.
 *
 * @param routeMiddlewareManager {RouteMiddlewareManager}
 * @constructor
 */
function MiddlewareCanister(routeMiddlewareManager) {
    'use strict';

    this._middleware = [];
    this._routeMiddlewareManager = routeMiddlewareManager;
}


/**
 * @param routeMiddlewareManager {RouteMiddlewareManager}
 * @returns {MiddlewareCanister}
 */
MiddlewareCanister.new = function (routeMiddlewareManager) {
    'use strict';

    return new MiddlewareCanister(routeMiddlewareManager);
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
 * @param method {string}
 * @param specification {string}
 */
MiddlewareCanister.prototype.forRoute = function (method, specification) {
    'use strict';

    _.each(this._middleware, function (middleware) {
        this._routeMiddlewareManager.addMiddlewareForRoute(method, specification, middleware);
    }, this);

};

/**
 * Terminating method for adding the canister's set of middleware to the route middleware
 * manager for all routes.
 */
MiddlewareCanister.prototype.forAllRoutes = function () {
    'use strict';

    _.each(this._middleware, function (middleware) {
        this._routeMiddlewareManager.addGlobalMiddleware(middleware);
    }, this);

};

/**
 * Terminating method for adding the canister's set of middleware to the route middleware
 * manager for all GET method routes.
 */
MiddlewareCanister.prototype.forAllGets = function () {
    'use strict';

    this._addMiddlewareForMethod(this._middleware, 'GET');

};

/**
 * Terminating method for adding the canister's set of middleware to the route middleware
 * manager for all POST method routes.
 */
MiddlewareCanister.prototype.forAllPosts = function () {
    'use strict';

    this._addMiddlewareForMethod(this._middleware, 'POST');

};

/**
 * Terminating method for adding the canister's set of middleware to the route middleware
 * manager for all PUT method routes.
 */
MiddlewareCanister.prototype.forAllPuts = function () {
    'use strict';

    this._addMiddlewareForMethod(this._middleware, 'PUT');

};

/**
 * Terminating method for adding the canister's set of middleware to the route middleware
 * manager for all DELETE method routes.
 */
MiddlewareCanister.prototype.forAllDeletes = function () {
    'use strict';

    this._addMiddlewareForMethod(this._middleware, 'DELETE');

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
        this._routeMiddlewareManager.addMiddlewareForMethod(method, middleware);
    }, this);

};
