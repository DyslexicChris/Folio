var SendObjectDecoration = require('./response-decorations/SendObjectDecoration');
var RenderViewDecoration = require('./response-decorations/RenderViewDecoration');

module.exports = ObjectDecorationFactory;

/**
 *
 * @constructor
 */
function ObjectDecorationFactory() {

}

/**
 *
 * @returns {SendObjectDecoration}
 */
ObjectDecorationFactory.prototype.sendObjectDecoration = function () {
    'use strict';

    return new SendObjectDecoration();
};

/**
 *
 * @param renderEngine
 * @returns {RenderViewDecoration}
 */
ObjectDecorationFactory.prototype.renderViewDecoration = function (renderEngine) {
    'use strict';

    return new RenderViewDecoration(renderEngine);
};
