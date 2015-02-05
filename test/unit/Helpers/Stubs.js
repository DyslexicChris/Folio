var sinon = require('sinon');
var fs = require('fs');

module.exports = {
    newRequest: newRequest,
    newRequestFromFile: newRequestFromFile,
    newResponse: newResponse,
    newRenderEngine: newRenderEngine,
    newDecoration: newDecoration,
    newFunction: newFunction,
    newGuildCacheInstance: newGuildCacheInstance,
    guildCacheModule: guildCacheModule
};

/**
 *
 * @returns {{on: *, connection: {destroy: *}}}
 */
function newRequest() {
    'use strict';

    return {
        on: sinon.stub(),
        connection: {
            destroy: sinon.stub()
        }
    };
}

/**
 *
 * @param absolutePath
 * @returns {*}
 */
function newRequestFromFile(absolutePath) {
    'use strict';

    return fs.createReadStream(absolutePath, {
        encoding: 'utf8'
    });
}

/**
 *
 * @returns {{end: *, write: *, setHeader: *, getHeader: *}}
 */
function newResponse() {
    'use strict';

    return {
        end: sinon.stub(),
        write: sinon.stub(),
        setHeader: sinon.stub(),
        getHeader: sinon.stub()
    };
}

/**
 *
 * @returns {{render: *}}
 */
function newRenderEngine() {
    'use strict';

    return {
        render: sinon.stub()
    };
}

/**
 *
 * @returns {{decorate: *}}
 */
function newDecoration() {
    'use strict';

    return {
        decorate: sinon.stub()
    };
}

/**
 *
 * @returns {*}
 */
function newFunction() {
    'use strict';

    return sinon.stub();
}

/**
 *
 * @returns {{get: *, put: *, reset: *}}
 */
function newGuildCacheInstance() {
    'use strict';

    return {
        get: sinon.stub(),
        put: sinon.stub(),
        reset: sinon.stub()
    };
}

/**
 *
 * @returns {{cacheWithSize: *}}
 * @constructor
 */
function guildCacheModule() {
    'use strict';

    return {
        cacheWithSize: sinon.stub()
    };
}
