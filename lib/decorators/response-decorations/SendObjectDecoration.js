module.exports = SendObjectDecoration;

var OK_STATUS_CODE = 200;
var DECORATION_NAME = 'send';
var CONTENT_TYPE_HEADER_KEY = 'Content-Type';
var CONTENT_TYPE_JSON_HEADER_VALUE = 'application/json';

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

    return function(sendableObject) {

        if(!objectToDecorate.statusCode){
            objectToDecorate.statusCode = OK_STATUS_CODE;
        }

        objectToDecorate.setHeader(CONTENT_TYPE_HEADER_KEY, CONTENT_TYPE_JSON_HEADER_VALUE);
        objectToDecorate.write(JSON.stringify(sendableObject));
        objectToDecorate.end();
    };
};