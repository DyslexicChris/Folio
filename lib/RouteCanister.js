var _ = require('underscore');

module.exports = RouteCanister;


/**
 * RouteCanister constructor.
 *
 * @classdesc Route canisters sit in front of the route middleware manager and route handler manager. They allow a middleware
 * or set of middleware to be registered with the route middleware manager; and a handler to be registered with the route
 * handler manager using a fluent API.
 *
 * @param method {string}
 * @param specification {string}
 * @param routeManager {RouteManager}
 * @param routeMiddlewareManager {RouteMiddlewareManager}
 * @param routeHandlerManager {RouteHandlerManager}
 * @constructor
 */
function RouteCanister(method, specification, routeManager, routeMiddlewareManager, routeHandlerManager) {
    'use strict';

    this._method = method;
    this._specification = specification;
    this._routeManager = routeManager;
    this._routeMiddlewareManager = routeMiddlewareManager;
    this._routeHandlerManager = routeHandlerManager;
}

/**
 * @param method {string}
 * @param specification {string}
 * @param routeManager {RouteManager}
 * @param routeMiddlewareManager {RouteMiddlewareManager}
 * @param routeHandlerManager {RouteHandlerManager}
 * @returns {RouteCanister}
 */
RouteCanister.new = function (method, specification, routeManager, routeMiddlewareManager, routeHandlerManager) {
    return new RouteCanister(method, specification, routeManager, routeMiddlewareManager, routeHandlerManager);
};

/**
 * Adds one or more middleware to the {@link RouteMiddlewareManager} instance for the canister's configured route.
 *
 * @param arguments
 * @returns {RouteCanister}
 */
RouteCanister.prototype.middleware = function () {
    'use strict';

    // TODO: check that middleware is defined and is a function.
    if (arguments.length) {
        _.each(arguments, function (middleware) {
            this._routeMiddlewareManager.addMiddlewareForRoute(this._method, this._specification, middleware);
        }, this);
    }

    return this;
};

/**
 * Adds a handler to the {@link RouteHandlerManager} instance for the canister's configured route.
 *
 * @param handler {function}
 */
RouteCanister.prototype.handler = function (handler) {
    'use strict';

    // TODO: check that handler is defined and is a function.
    this._routeManager.addRoute(this._method, this._specification);
    this._routeHandlerManager.addHandlerForRoute(this._method, this._specification, handler);

};
