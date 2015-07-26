var ObjectDecorator = require('./ObjectDecorator');

module.exports = ObjectDecoratorFactory;

/**
 *
 * @param objectDecorationFactory {ObjectDecorationFactory}
 * @constructor
 */
function ObjectDecoratorFactory(objectDecorationFactory) {
    'use strict';

    if (!objectDecorationFactory) {
        throw new Error('ObjectDecoratorFactory requires ObjectDecorationFactory');
    }

    this.objectDecorationFactory = objectDecorationFactory;
}

/**
 *
 * @returns {ObjectDecorator}
 */
ObjectDecoratorFactory.prototype.requestDecorator = function () {
    'use strict';

    return new ObjectDecorator();
};

/**
 *
 * @returns {ObjectDecorator}
 */
ObjectDecoratorFactory.prototype.responseDecorator = function () {
    'use strict';

    var responseDecorator = new ObjectDecorator();
    responseDecorator.addDecoration(this.objectDecorationFactory.sendObjectDecoration());

    return responseDecorator;
};
