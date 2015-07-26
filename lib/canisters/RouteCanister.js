var _ = require('underscore');

module.exports = RouteCanister;


/**
 * RouteCanister constructor.
 *
 * @classdesc Route canisters sit in front of the route middleware manager and route handler manager. They allow a middleware
 * or set of middleware to be registered with the route middleware manager; and a handler to be registered with the route
 * handler manager using a fluent API.
 *
 * @param route {Route}
 * @param routeRegistry {RouteRegistry}
 * @param routeMiddlewareRegistry {RouteMiddlewareRegistry}
 * @param routeHandlerRegistry {RouteHandlerRegistry}
 * @constructor
 */
function RouteCanister(route, routeRegistry, routeMiddlewareRegistry, routeHandlerRegistry) {
    'use strict';

    this._route = route;
    this._routeRegistry = routeRegistry;
    this._routeMiddlewareRegistry = routeMiddlewareRegistry;
    this._routeHandlerRegistry = routeHandlerRegistry;
}

/**
 * @param route {Route}
 * @param routeRegistry {RouteRegistry}
 * @param routeMiddlewareRegistry {RouteMiddlewareRegistry}
 * @param routeHandlerRegistry {RouteHandlerRegistry}
 * @constructor
 */
RouteCanister.new = function (route, routeRegistry, routeMiddlewareRegistry, routeHandlerRegistry) {
    return new RouteCanister(route, routeRegistry, routeMiddlewareRegistry, routeHandlerRegistry);
};

/**
 * Adds one or more middleware to the {@link RouteMiddlewareRegistry} instance for the canister's configured route.
 *
 * @param arguments
 * @returns {RouteCanister}
 */
RouteCanister.prototype.middleware = function () {
    'use strict';

    // TODO: check that middleware is defined and is a function.
    if (arguments.length) {
        _.each(arguments, function (middleware) {
            this._routeMiddlewareRegistry.addMiddlewareForRoute(this._route, middleware);
        }, this);
    }

    return this;
};

/**
 * Adds a handler to the {@link RouteHandlerRegistry} instance for the canister's configured route.
 *
 * @param handler {function}
 */
RouteCanister.prototype.handler = function (handler) {
    'use strict';

    // TODO: check that handler is defined and is a function.
    this._routeRegistry.addRoute(this._route);
    this._routeHandlerRegistry.addHandlerForRoute(this._route, handler);

};
