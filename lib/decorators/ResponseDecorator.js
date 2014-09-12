var _ = require('underscore');

module.exports = ResponseDecorator;

/**
 * @constructor
 */
function ResponseDecorator() {
    'use strict';

    this.decorators = [];
}

/**
 * @param arguments - One or more decoration objects
 */
ResponseDecorator.prototype.addDecoration = function () {
    'use strict';

    _.each(arguments, function (decorator) {
        this.decorators.push(decorator);
    }, this);
};

/**
 * @param response {ServerResponse} HTTP response object
 */
ResponseDecorator.prototype.decorate = function (response) {
    'use strict';

    _.each(this.decorators, function (decorator) {
        response[decorator.name()] = decorator.function;
    });
};
