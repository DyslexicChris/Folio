var sinon = require('sinon');
var fs = require('fs');

module.exports = {
    newRequest: newRequest,
    newRequestFromFile: newRequestFromFile,
    newResponse: newResponse,
    newRenderEngine: newRenderEngine,
    newDecoration: newDecoration,
    newDecorator: newDecorator,
    newFunction: newFunction,
    newGuildCacheInstance: newGuildCacheInstance,
    guildCacheModule: guildCacheModule,
    newRouteResolver: newRouteResolver,
    newRouteRegistry: newRouteRegistry,
    newRouteMiddlewareRegistry: newRouteMiddlewareRegistry,
    newRouteHandlerRegistry: newRouteHandlerRegistry,
    newMiddlewareCaninster: newMiddlewareCaninster,
    newDomain: newDomain,
    newHTTPServer: newHTTPServer,
    HTTPModule: HTTPModule,
    LoggerModule: LoggerModule,
    newLogger: newLogger,
    newRequestHandler: newRequestHandler
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
        writeHead: sinon.stub(),
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
 * @returns {{addDecoration: *}}
 */
function newDecorator() {
    'use strict';

    return {
        addDecoration: sinon.stub()
    }
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

/**
 *
 * @returns {{addRoute: *}}
 */
function newRouteResolver() {
    'use strict';

    return {
        addRoute: sinon.stub(),
        reset: sinon.stub()
    };
}

/**
 *
 * @returns {{addRoute: *, routes: *, reset: *}}
 */
function newRouteRegistry() {
    'use strict';

    return {
        addRoute: sinon.stub(),
        routes: sinon.stub(),
        reset: sinon.stub()
    };
}

/**
 *
 * @returns {{addMiddlewareForRoute: *}}
 */
function newRouteMiddlewareRegistry() {
    'use strict';

    return  {
        getGlobalMiddleware: sinon.stub(),
        addGlobalMiddleware: sinon.stub(),
        getMiddlewareForMethod: sinon.stub(),
        addMiddlewareForMethod: sinon.stub(),
        getMiddlewareForRoute: sinon.stub(),
        addMiddlewareForRoute: sinon.stub(),
        reset: sinon.stub()
    };
}

/**
 *
 * @returns {{addHandlerForRoute: *}}
 */
function newRouteHandlerRegistry() {
    'use strict';

    return {
        getHandlerForRoute: sinon.stub(),
        addHandlerForRoute: sinon.stub(),
        reset: sinon.stub()
    };
}

/**
 *
 * @returns {{addMiddleware: *}}
 */
function newMiddlewareCaninster() {
    'use strict';

    return {
        addMiddleware: sinon.stub()
    };
}

/**
 *
 * @returns {{create: *, on: *, add: *, run: *}}
 */
function newDomain() {
    'use strict';

    var domain = {
        create: sinon.stub(),
        on: sinon.stub(),
        add: sinon.stub(),
        run: sinon.stub()
    };

    domain.create.returns(domain);
    domain.run.callsArg(0);

    return domain;
}

/**
 *
 * @returns {{listen: *, close: *}}
 */
function newHTTPServer() {
    'use strict';

    return {
        listen: sinon.stub(),
        close: sinon.stub()
    };
}

/**
 *
 * @returns {{createServer: *, close: *}}
 */
function HTTPModule() {
    'use strict';

    return {
        createServer: sinon.stub(),
        close: sinon.stub()
    };
}

/**
 *
 * @returns {{getLogger: *}}
 */
function LoggerModule() {
    'use strict';

    var logger = newLogger();

    var loggerModule = {
        getLogger: sinon.stub()
    };

    loggerModule.getLogger.returns(logger);

    return loggerModule;
}

/**
 *
 * @returns {{log: *, error: *, warn: *}}
 */
function newLogger() {
    'use strict';

    return {
        log: sinon.stub(),
        error: sinon.stub(),
        warn: sinon.stub()
    };
}

/**
 *
 * @returns {{handle: *}}
 */
function newRequestHandler() {
    'use strict';

    return {
        handle: sinon.stub()
    };
}
