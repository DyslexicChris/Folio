var _ = require('underscore');

module.exports = ObjectDecorator;

/**
 * @constructor
 */
function ObjectDecorator() {
    'use strict';

    this.decorations = [];
}

/**
 * @param arguments - One or more decoration objects
 */
ObjectDecorator.prototype.addDecoration = function () {
    'use strict';

    _.each(arguments, function (decoration) {
        this.decorations.push(decoration);
    }, this);
};

/**
 * @param object {Object} - Object to be decorated
 */
ObjectDecorator.prototype.decorate = function (object) {
    'use strict';

    _.each(this.decorations, function (decoration) {
        decoration.decorate(object);
    });
};
