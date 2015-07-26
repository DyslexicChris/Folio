module.exports = RouteRegistry;

/**
 *
 * @constructor
 */
function RouteRegistry() {
    'use strict';

    this._routes = [];
}

/**
 *
 * @param route {Route}
 */
RouteRegistry.prototype.addRoute = function (route) {
    'use strict';

    if (this._routes.indexOf(route) == -1) {
        this._routes.push(route);
    }

    // TODO: Clear RouteResolver cache.
};

/**
 *
 * @returns {Array}
 */
RouteRegistry.prototype.routes = function () {
    'use strict';

    return this._routes;
};


/**
 *
 */
RouteRegistry.prototype.reset = function () {
    'use strict';

    this._routes = [];
};
