module.exports = RenderViewDecoration;

var OK_STATUS_CODE = 200;
var DECORATION_NAME = 'renderView';
var CONTENT_TYPE_HEADER_KEY = 'Content-Type';
var CONTENT_TYPE_HTML_HEADER_VALUE = 'text/html';

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

    return function(viewName, model) {

        if(!objectToDecorate.statusCode){
            this.statusCode = OK_STATUS_CODE;
        }

        if(!objectToDecorate.getHeader(CONTENT_TYPE_HEADER_KEY)){
            objectToDecorate.setHeader(CONTENT_TYPE_HEADER_KEY, CONTENT_TYPE_HTML_HEADER_VALUE);
        }

        var renderedView = renderEngine.render(viewName, model);

        objectToDecorate.end(renderedView);
    };
};
