var cluster = require('cluster');
var os = require('os');
var Logger = require('./Logger');

module.exports = ProcessManager;

var MINIMUM_CLUSTER_WORKERS = 2;

/**
 *
 * @constructor
 */
function ProcessManager() {
    'use strict';

}

/**
 *
 * @param clusterizedFunction
 */
ProcessManager.prototype.clusterize = function (clusterizedFunction) {
    'use strict';

    if (cluster.isMaster) {
        var cpuCount = os.cpus().length;
        var workersToFork = Math.max(MINIMUM_CLUSTER_WORKERS, cpuCount);

        Logger.log('[ProcessManager] Clusterizing with %d workers', workersToFork);

        var forkedWorkerCount = 0;
        while (forkedWorkerCount < workersToFork) {
            cluster.fork();
            forkedWorkerCount++;
        }

        cluster.on('exit', this._clusterWorkerExitCallback);
    } else {
        clusterizedFunction();
    }

};


/**
 *
 * @private
 */
ProcessManager.prototype._clusterWorkerExitCallback = function () {
    'use strict';

    Logger.log('Worker shutdown. Forking a new one.');
    cluster.fork();
};