module.exports = Route;

/**
 *
 * @constructor
 */
function Route() {

}

/**
 *
 * @returns {String}
 */
Route.prototype.getMethod = function () {
    'use strict';

    return this._method;
};

/**
 *
 * @param method {String}
 */
Route.prototype.setMethod = function (method) {
    'use strict';

    this._method = method.toLowerCase();
};

/**
 *
 * @returns {String}
 */
Route.prototype.getSpecification = function () {
    'use strict';

    return this._specification;
};

/**
 *
 * @param specification {String}
 */
Route.prototype.setSpecification = function (specification) {
    'use strict';

    this._specification = specification;
};

/**
 *
 * @param regex {RegEx}
 */
Route.prototype.setRegex = function (regex) {
    'use strict';

    this._regex = regex;
};

/**
 *
 * @returns {RegEx}
 */
Route.prototype.getRegex = function () {
    'use strict';

    return this._regex;
};

/**
 *
 * @param variableComponents {Object}
 */
Route.prototype.setVariableComponents = function (variableComponents) {
    'use strict';

    this._variableComponents = variableComponents;
};

/**
 *
 * @returns {Array}
 */
Route.prototype.getVariableComponents = function () {
    'use strict';

    return this._variableComponents;
};

/**
 *
 * @returns {String}
 */
Route.prototype.toString = function () {
    'use strict';

    return this.getMethod() + this.getSpecification();
};
