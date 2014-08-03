var _ = require('underscore');

module.exports = RouteCanister;


/**
 *
 * @param method
 * @param specification
 * @param routeManager
 * @param routeMiddlewareManager
 * @param routeHandlerManager
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
 *
 * @param method
 * @param specification
 * @param routeManager
 * @param routeMiddlewareManager
 * @param routeHandlerManager
 * @returns {RouteCanister}
 */
RouteCanister.new = function(method, specification, routeManager, routeMiddlewareManager, routeHandlerManager){
    return new RouteCanister(method, specification, routeManager, routeMiddlewareManager, routeHandlerManager);
};

/**
 *
 * @returns {*}
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
 *
 * @param handler
 */
RouteCanister.prototype.handler = function (handler) {
    'use strict';

    // TODO: check that handler is defined and is a function.
    this._routeManager.addRoute(this._method, this._specification);
    this._routeHandlerManager.addHandlerForRoute(this._method, this._specification, handler);

};

/**
 *
 * @returns {*}
 */
RouteCanister.prototype.getMethod = function(){
    'use strict';

    return this._method;
};

/**
 *
 * @returns {*}
 */
RouteCanister.prototype.getSpecification = function(){
    'use strict';

    return this._specification;
};