module.exports = RouteSpecificationParser;


var VARIABLE_COMPONENT_DECLARATION_REPLACEMENT_REGEX_STRING = '([a-zA-Z0-9%\\-_\\.]+)',
    WILDCARD_EMBEDDED_DECLARATION_MATCH_REGEX = /(\*)/ig,
    WILDCARD_EMBEDDED_DECLARATION_REPLACEMENT_REGEX_STRING = '[a-zA-Z0-9%\\-_\\.\/]*',
    FORWARD_SLASH_MATCH_REGEX = /\//ig,
    FORWARD_SLASH_REPLACEMENT_REGEX_STRING = '\\/',
    ENDING_FORWARD_SLASH_MATCH_REGEX = /(\\\/)$/,
    EMPTY_STRING = '',
    OPTIONAL_ENDING_SLASH_REGEX_STRING = '(?:\\/)?',
    VARIABLE_COMPONENT_DECLARATION_MATCH_REGEX = /:([a-zA-Z0-9]+)/ig,
    VARIABLE_COMPONENT_NAME_MATCH_INDEX = 1,
    SPECIFICATION_VALIDATION_REGEX = new RegExp('^(?:/(?::)?[a-z0-9\\-_\\.]+)*(?:(?:/\\*)|(?:/))?$', 'i'),
    INVALID_SPECIFICATION_ERROR_MESSAGE = 'Invalid route specification';

/**
 *
 * @constructor
 */
function RouteSpecificationParser() {

}

/**
 *
 * @param specification {String}
 */
RouteSpecificationParser.prototype.validateSpecification = function (specification) {
    'use strict';

    if (!SPECIFICATION_VALIDATION_REGEX.test(specification)) {
        throw new Error(INVALID_SPECIFICATION_ERROR_MESSAGE);
    }
};


/**
 *
 * @param specification {String}
 * @returns {RegExp}
 */
RouteSpecificationParser.prototype.buildRegEx = function (specification) {
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
 *
 * @param specification {String}
 * @returns {Array}
 */
RouteSpecificationParser.prototype.extractVariableComponents = function (specification) {
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
