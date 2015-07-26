var HTTPConstants = require('../../constants/HTTPConstants');

module.exports = SendObjectDecoration;

var DECORATION_NAME = 'send';

/**
 * @constructor
 */
function SendObjectDecoration() {
    'use strict';
}

/**
 *
 * @param objectToDecorate
 */
SendObjectDecoration.prototype.decorate = function (objectToDecorate) {
    'use strict';

    objectToDecorate[this._name()] = this._decoration(objectToDecorate);
};

/**
 *
 * @returns {string}
 * @private
 */
SendObjectDecoration.prototype._name = function () {
    'use strict';

    return DECORATION_NAME;
};

/**
 *
 * @param objectToDecorate
 * @returns {Function}
 * @private
 */
SendObjectDecoration.prototype._decoration = function (objectToDecorate) {
    'use strict';

    return function (sendableObject) {

        if (!objectToDecorate.statusCode) {
            objectToDecorate.statusCode = HTTPConstants.statusCodes.OK;
        }

        objectToDecorate.setHeader(HTTPConstants.headerKeys.CONTENT_TYPE, HTTPConstants.contentTypes.JSON);
        objectToDecorate.write(JSON.stringify(sendableObject));
        objectToDecorate.end();
    };
};