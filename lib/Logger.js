module.exports = Logger;

/**
 * @classdesc The logger is simply a facade for console logging functions. Its main purpose in the framework
 * is to provide a way to stub out console in tests.
 *
 * @param sink (e.g. console)
 * @constructor
 */
function Logger(sink){
    'use strict';

    this.sink = sink;
}

/**
 * Returns a the configured logger. If a logger is not configured, a logger for console output will be returned.
 *
 * @returns {Logger}
 */
Logger.getLogger = function(){
    'use strict';

    if(!Logger.defaultLogger){
        Logger.defaultLogger = new Logger(console);
    }

    return Logger.defaultLogger;
};

/**
 * @param logger {Logger}
 */
Logger.setLogger = function(logger){
    'use strict';

    Logger.defaultLogger = logger;
};

/**
 * @param arguments
 */
Logger.prototype.log = function(){
    'use strict';

    this.sink.log.apply(console, arguments);
};

/**
 * @param arguments
 */
Logger.prototype.error = function(){
    'use strict';

    this.sink.error.apply(console, arguments);
};


/**
 * @param arguments
 */
Logger.prototype.warn = function(){
    'use strict';

    this.sink.warn.apply(console, arguments);
};
