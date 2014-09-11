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
 * @returns {string}
 */
SendObjectDecoration.prototype.name = function () {
    'use strict';

    return DECORATION_NAME;
};

/**
 * @param object {Object} An object to send in the response as JSON
 */
SendObjectDecoration.prototype.function = function (object) {
    'use strict';

    if(!this.statusCode){
        this.statusCode = OK_STATUS_CODE;
    }

    this.setHeader(CONTENT_TYPE_HEADER_KEY, CONTENT_TYPE_JSON_HEADER_VALUE);
    this.write(JSON.stringify(object));
    this.end();
};