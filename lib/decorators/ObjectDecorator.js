var _ = require('underscore');

module.exports = ObjectDecorator;

/**
 * @constructor
 */
function ObjectDecorator() {
    'use strict';

    this.decorators = [];
}

/**
 * @param arguments - One or more decoration objects
 */
ObjectDecorator.prototype.addDecoration = function () {
    'use strict';

    _.each(arguments, function (decorator) {
        this.decorators.push(decorator);
    }, this);
};

/**
 * @param object {Object} - Object to be decorated
 */
ObjectDecorator.prototype.decorate = function (object) {
    'use strict';

    _.each(this.decorators, function (decorator) {
        object[decorator.name()] = decorator.function;
    });
};
