var JSONBodyParserFactory = require('./JSONBodyParserFactory');

module.exports = CoreMiddlewareFactory;

/**
 *
 * @constructor
 */
function CoreMiddlewareFactory() {
    'use strict';

    this.jsonBodyParserFactory = new JSONBodyParserFactory();
}

/**
 *
 * @returns {Function}
 * @constructor
 */
CoreMiddlewareFactory.prototype.jsonBodyParser = function () {
    'use strict';

    return this.jsonBodyParserFactory.newMiddleware();
};
