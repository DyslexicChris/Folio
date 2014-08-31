var _ = require('underscore');

module.exports = RouteHandlerManager;

/**
 * RouteHandlerManager constructor.
 *
 * @classdesc The RouteHandlerManager looks after handler functions for routes. The handler for a route is the final
 * function called, after any middleware, that is intended to handle an inbound request for that route.
 *
 * @constructor
 */
function RouteHandlerManager() {
    'use strict';

    this._routeHandlers = {};
}

/**
 * @param method {string}
 * @param specification {string}
 * @param handler {function}
 */
RouteHandlerManager.prototype.addHandlerForRoute = function (method, specification, handler) {
    'use strict';

    this._validateHandler(handler);
    this._routeHandlers[method] = (this._routeHandlers[method] || {});
    this._routeHandlers[method][specification] = handler;

};

/**
 * @param method {string}
 * @param specification {string}
 * @returns {function}
 */
RouteHandlerManager.prototype.getHandlerForRoute = function (method, specification) {
    'use strict';

    return this._routeHandlers[method] && this._routeHandlers[method][specification];
};

/**
 * Resets route handlers
 */
RouteHandlerManager.prototype.reset = function(){
    'use strict';

    this._routeHandlers = {};
};

/**
 * @param handler {function}
 * @private
 */
RouteHandlerManager.prototype._validateHandler = function (handler) {
    'use strict';

    if (!_.isFunction(handler)) {
        throw new Error('Handler is not a function');
    }
};