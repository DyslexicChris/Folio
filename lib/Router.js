/*
 * Router
 * ======
 *
 */

/**
 *
 * @constructor
 */
var Router = function () {
    'use strict';

    this.routes = [];
};

/**
 * Module exports
 *
 */
module.exports = Router;

var _ = require('underscore');

var ROUTE_SPECIFICATION_VALIDATION_REGEX = new RegExp('^(?:/(?::)?[a-z0-9\\-_\\.]+)*(?:(?:/\\*)|(?:/))?$', 'i'),
    VARIABLE_COMPONENT_DECLARATION_MATCH_REGEX = /:([a-zA-Z0-9]+)/ig,
    VARIABLE_COMPONENT_DECLARATION_REPLACEMENT_REGEX_STRING = '([a-z0-9%\\-_\\.]+)',
    VARIABLE_COMPONENT_NAME_MATCH_INDEX = 1,
    WILDCARD_EMBEDDED_DECLARATION_MATCH_REGEX = /(\*)/ig,
    WILDCARD_EMBEDDED_DECLARATION_REPLACEMENT_REGEX_STRING = '[a-z0-9%\\-_\\.\/]*',
    FORWARD_SLASH_MATCH_REGEX = /\//ig,
    FORWARD_SLASH_REPLACEMENT_REGEX_STRING = '\\/',
    ENDING_FORWARD_SLASH_MATCH_REGEX = /(\\\/)$/,
    EMPTY_STRING = '',
    OPTIONAL_ENDING_SLASH_REGEX_STRING = '(?:\\/)?';


/**
 *
 * @param method
 * @param routeSpec
 * @param finalHandler
 * @param preHandlers
 */
Router.prototype.addRoute = function (method, routeSpec, finalHandler, preHandlers) {

    this._validateRouteSpecification(routeSpec);

    var self = this;
    var preHandlersArray = this._preHandlersToArray(preHandlers);

    _.each(preHandlersArray, function (preHandler) {
        self._validateHandler(preHandler);
    });

    this._validateHandler(finalHandler);

    var route = {
        method: method.toLowerCase(),
        routeSpec: routeSpec,
        regex: this._createRouteRegex(routeSpec),
        variableComponents: this._extractVariableComponents(routeSpec),
        preHandlers: preHandlersArray,
        finalHandler: finalHandler
    };

    this.routes.push(route);
};


/**
 *
 * @param method
 * @param path
 * @returns {*}
 */
Router.prototype.matchPath = function (method, path) {

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
 * @param routeSpecification
 * @private
 */
Router.prototype._validateRouteSpecification = function (routeSpecification) {
    'use strict';

    if (!ROUTE_SPECIFICATION_VALIDATION_REGEX.test(routeSpecification)) {
        throw new Error('Invalid route specification');
    }
};

/**
 *
 * @param preHandlers
 * @returns []
 * @private
 */
Router.prototype._preHandlersToArray = function (preHandlers) {

    var preHandlersArray = preHandlers || [];

    if (!_.isArray(preHandlers) && preHandlers) {
        preHandlersArray = [preHandlers];
    }

    return preHandlersArray;
};


/**
 *
 * @param handler
 * @private
 */
Router.prototype._validateHandler = function (handler) {

    if (!_.isFunction(handler)) {
        throw new Error('Handler is not a function');
    }
};


/**
 *
 * @param routeSpecification
 * @returns RegExp
 * @private
 */
Router.prototype._createRouteRegex = function (routeSpecification) {

    var routeSpecRegex = routeSpecification
        .replace(/\./ig, '\\.')
        .replace(WILDCARD_EMBEDDED_DECLARATION_MATCH_REGEX, WILDCARD_EMBEDDED_DECLARATION_REPLACEMENT_REGEX_STRING)
        .replace(VARIABLE_COMPONENT_DECLARATION_MATCH_REGEX, VARIABLE_COMPONENT_DECLARATION_REPLACEMENT_REGEX_STRING)
        .replace(FORWARD_SLASH_MATCH_REGEX, FORWARD_SLASH_REPLACEMENT_REGEX_STRING)
        .replace(ENDING_FORWARD_SLASH_MATCH_REGEX, EMPTY_STRING)
        .concat(OPTIONAL_ENDING_SLASH_REGEX_STRING);

    return new RegExp('^' + routeSpecRegex + '$', 'i');
};


/**
 *
 * @param routeSpecification
 * @returns []
 * @private
 */
Router.prototype._extractVariableComponents = function (routeSpecification) {

    var variableComponents = [];

    for (var variableComponentMatch = VARIABLE_COMPONENT_DECLARATION_MATCH_REGEX.exec(routeSpecification);
         variableComponentMatch;
         variableComponentMatch = VARIABLE_COMPONENT_DECLARATION_MATCH_REGEX.exec(routeSpecification)) {

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
Router.prototype._processMatchingRoute = function (route, path) {

    var matchedRoute;
    var routeBreakdown = route.regex.exec(path);
    routeBreakdown.splice(0, 1);

    delete routeBreakdown.index;
    delete routeBreakdown.input;

    if (routeBreakdown.length === route.variableComponents.length) {

        matchedRoute = {
            specification: route.routeSpec,
            method: route.method,
            path: path,
            params: {},
            preHandlers: route.preHandlers,
            finalHandler: route.finalHandler
        };

        _.each(route.variableComponents, function (variableComponent, index) {
            matchedRoute.params[variableComponent] = routeBreakdown[index];
        });

    } else {
        throw new Error('Route error. Number of variable components did not match those in path.');
    }

    return matchedRoute;
};



