var Route = require('./Route');

module.exports = RouteFactory;

/**
 *
 * @param routeSpecificationParser {RouteSpecificationParser}
 * @constructor
 */
function RouteFactory(routeSpecificationParser) {
    'use strict';

    this._routeSpecificationParser = routeSpecificationParser;
}

/**
 *
 * @param method {String}
 * @param specification {String}
 * @returns {Route}
 */
RouteFactory.prototype.buildRoute = function (method, specification) {
    'use strict';

    this._routeSpecificationParser.validateSpecification(specification);

    var route = new Route();

    route.setMethod(method);
    route.setSpecification(specification);
    route.setRegex(this._routeSpecificationParser.buildRegEx(specification));
    route.setVariableComponents(this._routeSpecificationParser.extractVariableComponents(specification));

    return route;
};
