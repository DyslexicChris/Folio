var cluster = require('cluster');
var os = require('os');
var Logger = require('./Logger');

module.exports = ProcessManager;

var MINIMUM_CLUSTER_WORKERS = 2;
var CLUSTER_EXIT_EVENT = 'exit';

/**
 * ProcessManager Constructor
 *
 * @classdesc The process manager looks after the application's processes. It forks processes using the cluster module
 * when told to and when forked processes exit.
 *
 * @constructor
 */
function ProcessManager() {
    'use strict';

}

/**
 * When called given a function, processes will fork from the main process and execute the given function.
 * The number of processes is determined to be Math.max(2, cpuCount) forked processes plus the main process.
 * The main process will not execute the given function.
 *
 * When a forked process exits, a new process will be forked in its place.
 *
 * This method would not normally be called directly, but from the main Folio API.
 *
 * @example
 * var myFolioApp = new Folio();
 * myFolioApp.cluster(function(){
 *     myFolioApp.use(myMiddleware).forAllRoutes();
 *     myFolioApp.get('/example-A').handler(myHandlerA);
 *     myFolioApp.get('/example-B').handler(myHandlerB);
 *     myFolioApp.start(3000);
 * });
 *
 * @param clusterFunction {function}
 */
ProcessManager.prototype.cluster = function (clusterFunction) {
    'use strict';

    if (cluster.isMaster) {
        var cpuCount = os.cpus().length;
        var workersToFork = Math.max(MINIMUM_CLUSTER_WORKERS, cpuCount);

        Logger.getLogger().log('[ProcessManager] Clusterizing with %d workers', workersToFork);

        var forkedWorkerCount = 0;
        while (forkedWorkerCount < workersToFork) {
            cluster.fork();
            forkedWorkerCount++;
        }

        cluster.on(CLUSTER_EXIT_EVENT, this._clusterWorkerExitCallback);
    } else {
        clusterFunction();
    }

};


/**
 * @private
 */
ProcessManager.prototype._clusterWorkerExitCallback = function () {
    'use strict';

    Logger.getLogger().log('Worker shutdown. Forking a new one.');
    cluster.fork();
};