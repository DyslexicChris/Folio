var Logger = {};

module.exports = Logger;

/**
 *
 */
Logger.log = function(){
    'use strict';

    console.log.apply(console, arguments);
};

/**
 *
 */
Logger.error = function(){
    'use strict';

    console.error.apply(console, arguments);
};


/**
 *
 */
Logger.warn = function(){
    'use strict';

    console.warn.apply(console, arguments);
};
