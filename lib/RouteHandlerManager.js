var _ = require('underscore');

module.exports = RouteHandlerManager;

/**
 *
 * @constructor
 */
function RouteHandlerManager() {
    'use strict';

    this._routeHandlers = {};
}

/**
 *
 * @param method
 * @param specification
 * @param handler
 */
RouteHandlerManager.prototype.addHandlerForRoute = function (method, specification, handler) {
    'use strict';

    this._validateHandler(handler);
    this._routeHandlers[method] = (this._routeHandlers[method] || {});
    this._routeHandlers[method][specification] = handler;

};

/**
 *
 * @param method
 * @param specification
 * @returns {*}
 */
RouteHandlerManager.prototype.getHandlerForRoute = function (method, specification) {
    'use strict';

    return this._routeHandlers[method] && this._routeHandlers[method][specification];
};

/**
 *
 * @param handler
 * @private
 */
RouteHandlerManager.prototype._validateHandler = function (handler) {
    'use strict';

    if (!_.isFunction(handler)) {
        throw new Error('Handler is not a function');
    }
};