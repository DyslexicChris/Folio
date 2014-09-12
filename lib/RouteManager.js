var _ = require('underscore');

module.exports = RouteManager;

/**
 * @classdesc The RouteManager is responsible for looking after route definitions based on specification e.g.
 * '/test/route/:varA/:varB' and method e.g. 'GET'. It can be queried using a requested path and method to return
 * a matching route. If a matching route is found and contains variable components, these components will be matched and
 * evaluated.
 *
 * @example
 * // Define routes
 * myRouteManager.addRoute('GET', '/example/:varA/:varB');
 * myRouteManager.addRoute('GET', '/example/other/:varA/:varB');
 *
 * // Query myRouteManager with a method and path
 * var matchedRoute = myRouteManager.query('GET', '/example/123/ABC');
 *
 * // The above will return the following object:
 * {
 *     specification: '/example/:varA/:varB',
 *     method: 'GET',
 *     path: '/example/123/ABC',
 *     params: {
 *         varA: '123',
 *         varB: 'ABC'
 *     }
 * }
 *
 * @constructor
 */
function RouteManager() {
    'use strict';

    this.routes = [];
    this._routeMapCache = {};
}

var SPECIFICATION_VALIDATION_REGEX = new RegExp('^(?:/(?::)?[a-z0-9\\-_\\.]+)*(?:(?:/\\*)|(?:/))?$', 'i'),
    VARIABLE_COMPONENT_DECLARATION_MATCH_REGEX = /:([a-zA-Z0-9]+)/ig,
    VARIABLE_COMPONENT_DECLARATION_REPLACEMENT_REGEX_STRING = '([a-z0-9%\\-_\\.]+)',
    VARIABLE_COMPONENT_NAME_MATCH_INDEX = 1,
    WILDCARD_EMBEDDED_DECLARATION_MATCH_REGEX = /(\*)/ig,
    WILDCARD_EMBEDDED_DECLARATION_REPLACEMENT_REGEX_STRING = '[a-z0-9%\\-_\\.\/]*',
    FORWARD_SLASH_MATCH_REGEX = /\//ig,
    FORWARD_SLASH_REPLACEMENT_REGEX_STRING = '\\/',
    ENDING_FORWARD_SLASH_MATCH_REGEX = /(\\\/)$/,
    EMPTY_STRING = '',
    OPTIONAL_ENDING_SLASH_REGEX_STRING = '(?:\\/)?',
    INVALID_SPECIFICATION_ERROR_MESSAGE = 'Invalid route specification',
    VARIABLE_COMPONENTS_MISMATCH_ERROR_MESSAGE = 'Route error. Number of variable components did not match those in path.';


/**
 * Does what it says on the tin. Note that a side-effect of adding a route is the route mapping cache being reset.
 *
 * @example
 * myRouteManager.addRoute('GET', '/example/:varA/:varB');
 * myRouteManager.addRoute('GET', '/example/other/:varA/:varB');
 *
 * @param method {String}
 * @param specification {String}
 */
RouteManager.prototype.addRoute = function (method, specification) {
    'use strict';

    this._validateSpecification(specification);

    var route = {
        method: method.toLowerCase(),
        specification: specification,
        regex: this._createRouteRegex(specification),
        variableComponents: this._extractVariableComponents(specification)
    };

    this.routes.push(route);
    this._invalidateRouteMappingCache();
};


/**
 * @param method {String}
 * @param path {String}
 * @returns {Route}
 *
 * @example
 * myRouteManager.addRoute('GET', '/example/:varA/:varB');
 * var matchedRoute = myRouteManager.query('GET', '/example/123/ABC');
 *
 * // Returns an object that looks like this:
 * {
 *     specification: '/example/:varA/:varB',
 *     method: 'GET',
 *     path: '/example/123/ABC',
 *     params: {
 *         varA: '123',
 *         varB: 'ABC'
 *     }
 * }
 */
RouteManager.prototype.query = function (method, path) {
    'use strict';

    return this._lookupCachedRouteForMethodAndPath(method, path) ||
        this._matchRouteByTestingSpecifications(method, path);
};

/**
 * Resets routes and route map cache.
 */
RouteManager.prototype.reset = function () {
    'use strict';

    this.routes = [];
    this._routeMapCache = {};
};

/**
 * @param method {String}
 * @param path {String}
 * @returns {Route}
 * @private
 */
RouteManager.prototype._matchRouteByTestingSpecifications = function (method, path) {
    'use strict';

    var matchedRoute;

    for (var routeCount = 0; (routeCount < this.routes.length && !matchedRoute); routeCount += 1) {

        var currentRoute = this.routes[routeCount];
        var routeFound = (method.toLowerCase() === currentRoute.method) && currentRoute.regex.test(path);

        if (routeFound) {
            matchedRoute = this._processMatchingRoute(currentRoute, path);
            this._cacheRouteForMethodAndPath(method, path, matchedRoute);
        }
    }

    return matchedRoute;
};

/**
 * @param method {String}
 * @param path {String}
 * @returns {Route}
 * @private
 */
RouteManager.prototype._lookupCachedRouteForMethodAndPath = function (method, path) {
    'use strict';

    return this._routeMapCache[this._routeMapCacheKeyForMethodAndPath(method, path)];
};

/**
 * @param method {String}
 * @param path {String}
 * @param route {Route}
 * @private
 */
RouteManager.prototype._cacheRouteForMethodAndPath = function (method, path, route) {
    'use strict';

    this._routeMapCache[this._routeMapCacheKeyForMethodAndPath(method, path)] = route;
};

/**
 * @param method {String}
 * @param path {String}
 * @returns {String}
 * @private
 */
RouteManager.prototype._routeMapCacheKeyForMethodAndPath = function (method, path) {
    'use strict';

    return (method.toLowerCase() + path);
};

/**
 * Resets the route mapping cache.
 *
 * @private
 */
RouteManager.prototype._invalidateRouteMappingCache = function () {
    'use strict';

    this._routeMapCache = {};
};

/**
 * @param specification {String}
 * @private
 */
RouteManager.prototype._validateSpecification = function (specification) {
    'use strict';

    if (!SPECIFICATION_VALIDATION_REGEX.test(specification)) {
        throw new Error(INVALID_SPECIFICATION_ERROR_MESSAGE);
    }
};


/**
 * @param specification {String}
 * @returns RegExp {RegExp}
 * @private
 */
RouteManager.prototype._createRouteRegex = function (specification) {
    'use strict';

    var specificationRegEx = specification
        .replace(/\./ig, '\\.')
        .replace(WILDCARD_EMBEDDED_DECLARATION_MATCH_REGEX, WILDCARD_EMBEDDED_DECLARATION_REPLACEMENT_REGEX_STRING)
        .replace(VARIABLE_COMPONENT_DECLARATION_MATCH_REGEX, VARIABLE_COMPONENT_DECLARATION_REPLACEMENT_REGEX_STRING)
        .replace(FORWARD_SLASH_MATCH_REGEX, FORWARD_SLASH_REPLACEMENT_REGEX_STRING)
        .replace(ENDING_FORWARD_SLASH_MATCH_REGEX, EMPTY_STRING)
        .concat(OPTIONAL_ENDING_SLASH_REGEX_STRING);

    return new RegExp('^' + specificationRegEx + '$');
};


/**
 * @param specification {String}
 * @returns {Array}
 * @private
 */
RouteManager.prototype._extractVariableComponents = function (specification) {
    'use strict';

    var variableComponents = [];

    for (var variableComponentMatch = VARIABLE_COMPONENT_DECLARATION_MATCH_REGEX.exec(specification);
         variableComponentMatch;
         variableComponentMatch = VARIABLE_COMPONENT_DECLARATION_MATCH_REGEX.exec(specification)) {

        if (variableComponentMatch[VARIABLE_COMPONENT_NAME_MATCH_INDEX]) {
            variableComponents.push(variableComponentMatch[VARIABLE_COMPONENT_NAME_MATCH_INDEX]);
        }
    }

    return variableComponents;
};

/**
 *
 * @param route {Route}
 * @param path {String}
 * @returns {Route}
 * @private
 */
RouteManager.prototype._processMatchingRoute = function (route, path) {
    'use strict';

    var matchedRoute;
    var routeBreakdown = route.regex.exec(path);
    routeBreakdown.splice(0, 1);

    delete routeBreakdown.index;
    delete routeBreakdown.input;

    if (routeBreakdown.length === route.variableComponents.length) {

        matchedRoute = {
            specification: route.specification,
            method: route.method,
            path: path,
            params: {}
        };

        _.each(route.variableComponents, function (variableComponent, index) {
            matchedRoute.params[variableComponent] = routeBreakdown[index];
        });

    } else {
        throw new Error(VARIABLE_COMPONENTS_MISMATCH_ERROR_MESSAGE);
    }

    return matchedRoute;
};
