var _ = require('underscore');

module.exports = RouteHandlerManager;

/**
 *
 * @constructor
 */
function RouteHandlerManager(){
    'use strict';

    this._routeHandlers = {};
}

/**
 *
 * @param route
 * @param handler
 */
RouteHandlerManager.prototype.addHandlerForRoute = function(route, handler) {
    'use strict';

    this._validateHandler(handler);
    this._routeHandlers[route.specification] = handler;

};

/**
 *
 * @param route
 * @returns {*}
 */
RouteHandlerManager.prototype.getHandlerForRoute= function(route) {
    'use strict';

    return this._routeHandlers[route.specification];
};

/**
 *
 * @param handler
 * @private
 */
RouteHandlerManager.prototype._validateHandler = function(handler) {
    'use strict';

    if (!_.isFunction(handler)) {
        throw new Error('Handler is not a function');
    }
};