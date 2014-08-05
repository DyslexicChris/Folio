var _ = require('underscore');

module.exports = RouteMiddlewareManager;

var INVALID_MIDDLEWARE_ERROR_MESSAGE = 'Middleware is not a function';

/**
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
 *
 * @param method
 * @param specification
 * @param middleware
 */
RouteMiddlewareManager.prototype.addMiddlewareForRoute = function (method, specification, middleware) {
    'use strict';

    this._validateMiddleware(middleware);
    this._routeMiddleware[method] = (this._routeMiddleware[method] || {});
    this._routeMiddleware[method][specification] = (this._routeMiddleware[method][specification] || []);
    this._routeMiddleware[method][specification].push(middleware);

};


/**
 *
 * @param method
 * @param middleware
 */
RouteMiddlewareManager.prototype.addMiddlewareForMethod = function (method, middleware) {
    'use strict';

    this._addMiddleware(method, middleware);
};


/**
 *
 * @param middleware
 */
RouteMiddlewareManager.prototype.addGlobalMiddleware = function (middleware) {
    'use strict';

    this._addMiddleware('global', middleware);

};

/**
 *
 * @param middlewareGroup
 * @param middleware
 * @private
 */
RouteMiddlewareManager.prototype._addMiddleware = function(middlewareGroup, middleware) {

    this._validateMiddleware(middleware);
    this._methodMiddleware[middlewareGroup] = (this._methodMiddleware[middlewareGroup] || []);
    this._methodMiddleware[middlewareGroup].push(middleware);
    
};

/**
 *
 * @param method
 * @param specification
 * @returns Array
 */
RouteMiddlewareManager.prototype.getMiddlewareForRoute = function (method, specification) {
    'use strict';

    return this._routeMiddleware[method][specification] || [];

};

/**
 *
 * @param method
 * @returns Array
 */
RouteMiddlewareManager.prototype.getMiddlewareForMethod = function (method) {
    'use strict';

    return this._methodMiddleware[method] || [];
};

/**
 *
 * @returns Array
 */
RouteMiddlewareManager.prototype.getGlobalMiddleware = function () {
    'use strict';

    return this._methodMiddleware.global || [];

};

/**
 *
 * @param middleware
 * @private
 */
RouteMiddlewareManager.prototype._validateMiddleware = function (middleware) {
    'use strict';

    if (!_.isFunction(middleware)) {
        throw new Error(INVALID_MIDDLEWARE_ERROR_MESSAGE);
    }
};