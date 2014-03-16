var _ = require('underscore');

module.exports = RouteMiddlewareManager;

var INVALID_MIDDLEWARE_ERROR_MESSAGE = 'Middleware is not a function';

/**
 *
 * @constructor
 */
function RouteMiddlewareManager(){
    'use strict';

    this._routeMiddleware = {};
    this._globalMiddleware = [];
}

/**
 *
 * @param route
 * @param middleware
 */
RouteMiddlewareManager.prototype.addMiddlewareForRoute = function(route, middleware) {
    'use strict';

    this._validateMiddleware(middleware);

    if(!this._routeMiddleware[route.specification]){
        this._routeMiddleware[route.specification] = [];
    }

    this._routeMiddleware[route.specification].push(middleware);

};

/**
 *
 * @param middleware
 */
RouteMiddlewareManager.prototype.addGlobalMiddleware = function(middleware) {
    'use strict';

    this._validateMiddleware(middleware);
    this._globalMiddleware.push(middleware);

};

/**
 *
 * @param route
 * @returns Array
 */
RouteMiddlewareManager.prototype.getMiddlewareForRoute = function(route) {
    'use strict';

    return this._routeMiddleware[route.specification] || [];

};

/**
 *
 * @returns Array
 */
RouteMiddlewareManager.prototype.getGlobalMiddleware = function() {
    'use strict';

    return this._globalMiddleware || [];

};

/**
 *
 * @param middleware
 * @private
 */
RouteMiddlewareManager.prototype._validateMiddleware = function(middleware) {
    'use strict';

    if (!_.isFunction(middleware)) {
        throw new Error(INVALID_MIDDLEWARE_ERROR_MESSAGE);
    }
};