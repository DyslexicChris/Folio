var _ = require('underscore');



/**
 *
 * @param routeMiddlewareManager
 * @constructor
 */
function MiddlewareCanister(routeMiddlewareManager) {
    'use strict';

    this._middleware = [];
    this._routeMiddlewareManager = routeMiddlewareManager;
}


/**
 *
 * @param routeMiddlewareManager
 * @returns {MiddlewareCanister}
 */
MiddlewareCanister.new = function (routeMiddlewareManager) {
    'use strict';

    return new MiddlewareCanister(routeMiddlewareManager);
};

/**
 *
 * @returns Array
 */
MiddlewareCanister.prototype.middleware = function () {
    'use strict';

    return this._middleware;
};

/**
 *
 * @returns {*}
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
 *
 * @param middleware
 * @returns {*}
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

    return this;
};


/**
 *
 * @param method
 * @param specification
 */
MiddlewareCanister.prototype.forRoute = function (method, specification) {
    'use strict';

    _.each(this._middleware, function (middleware) {
        this._routeMiddlewareManager.addMiddlewareForRoute(method, specification, middleware);
    }, this);

};

/**
 *
 */
MiddlewareCanister.prototype.forAllRoutes = function () {
    'use strict';

    _.each(this._middleware, function (middleware) {
        this._routeMiddlewareManager.addGlobalMiddleware(middleware);
    }, this);

};

/**
 *
 */
MiddlewareCanister.prototype.forAllGets = function () {
    'use strict';

    this.addMiddlewareForMethod(this._middleware, 'GET');

};


MiddlewareCanister.prototype.addMiddlewareForMethod = function(middlewares, method) {

    _.each(middlewares, function (middleware) {
        this._routeMiddlewareManager.addMiddlewareForMethod(method, middleware);
    }, this);

};

/**
 *
 */
MiddlewareCanister.prototype.forAllPosts = function () {
    'use strict';

    this.addMiddlewareForMethod(this._middleware, 'POST');

};

/**
 *
 */
MiddlewareCanister.prototype.forAllPuts = function () {
    'use strict';

    this.addMiddlewareForMethod(this._middleware, 'PUT');

};

/**
 *
 */
MiddlewareCanister.prototype.forAllDeletes = function () {
    'use strict';

    this.addMiddlewareForMethod(this._middleware, 'DELETE');

};

module.exports = MiddlewareCanister;