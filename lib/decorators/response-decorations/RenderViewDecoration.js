var HTTPConstants = require('../../constants/HTTPConstants');

module.exports = RenderViewDecoration;

var DECORATION_NAME = 'renderView';

/**
 * @constructor
 */
function RenderViewDecoration(renderEngine) {
    'use strict';

    this._renderEngine = renderEngine;
}

/**
 *
 * @param objectToDecorate
 */
RenderViewDecoration.prototype.decorate = function (objectToDecorate) {
    'use strict';

    objectToDecorate[this._name()] = this._decoration(objectToDecorate);
};

/**
 *
 * @returns {string}
 * @private
 */
RenderViewDecoration.prototype._name = function () {
    'use strict';

    return DECORATION_NAME;
};

/**
 *
 * @param objectToDecorate
 * @returns {Function}
 * @private
 */
RenderViewDecoration.prototype._decoration = function (objectToDecorate) {
    'use strict';

    var renderEngine = this._renderEngine;

    return function (viewName, model) {

        if (!objectToDecorate.statusCode) {
            this.statusCode = HTTPConstants.statusCodes.OK;
        }

        if (!objectToDecorate.getHeader(HTTPConstants.headerKeys.CONTENT_TYPE)) {
            objectToDecorate.setHeader(HTTPConstants.headerKeys.CONTENT_TYPE, HTTPConstants.contentTypes.HTML);
        }

        var renderedView = renderEngine.render(viewName, model);

        objectToDecorate.end(renderedView);
    };
};
