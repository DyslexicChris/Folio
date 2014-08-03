var _ = require('underscore');

module.exports = RouteManager;

/**
 *
 * @constructor
 */
function RouteManager() {
    'use strict';

    this.routes = [];
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
 *
 * @param method
 * @param specification
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
};


/**
 *
 * @param method
 * @param path
 * @returns {*}
 */
RouteManager.prototype.matchPath = function (method, path) {
    'use strict';

    var matchedRoute;
    var currentRoute;
    var routeFound = false;

    for (var routeCount = 0; (routeCount < this.routes.length && !routeFound); routeCount += 1) {

        currentRoute = this.routes[routeCount];
        routeFound = (method.toLowerCase() === currentRoute.method) && currentRoute.regex.test(path);

        if (routeFound) {
            routeFound = true;
            matchedRoute = this._processMatchingRoute(currentRoute, path);
        }
    }

    return matchedRoute;
};


/**
 *
 * @param specification
 * @private
 */
RouteManager.prototype._validateSpecification = function (specification) {
    'use strict';

    if (!SPECIFICATION_VALIDATION_REGEX.test(specification)) {
        throw new Error(INVALID_SPECIFICATION_ERROR_MESSAGE);
    }
};


/**
 *
 * @param specification
 * @returns RegExp
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

    return new RegExp('^' + specificationRegEx + '$', 'i');
};


/**
 *
 * @param specification
 * @returns []
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
 * @param route
 * @param path
 * @returns {*}
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



