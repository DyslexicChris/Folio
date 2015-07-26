var _ = require('underscore');

module.exports = RouteHandlerRegistry;

/**
 * RouteHandlerRegistry constructor.
 *
 * @classdesc The RouteHandlerRegistry looks after handler functions for routes. The handler for a route is the final
 * function called, after any middleware, that is intended to handle an inbound request for that route.
 *
 * @constructor
 */
function RouteHandlerRegistry() {
    'use strict';

    this._routeHandlers = {};
}

/**
 *
 * @param route {Route}
 * @param handler {Route}
 */
RouteHandlerRegistry.prototype.addHandlerForRoute = function (route, handler) {
    'use strict';

    this._validateHandler(handler);
    this._routeHandlers[route.toString()] = handler;
};

/**
 *
 * @param route {Route}
 * @returns {Function}
 */
RouteHandlerRegistry.prototype.getHandlerForRoute = function (route) {
    'use strict';

    return this._routeHandlers[route.toString()];
};

/**
 * Resets route handlers
 */
RouteHandlerRegistry.prototype.reset = function () {
    'use strict';

    this._routeHandlers = {};
};

/**
 * @param handler {function}
 * @private
 */
RouteHandlerRegistry.prototype._validateHandler = function (handler) {
    'use strict';

    if (!_.isFunction(handler)) {
        throw new Error('Handler is not a function');
    }
};
