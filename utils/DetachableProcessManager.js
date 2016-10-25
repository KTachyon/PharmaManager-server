var _ = require('lodash');

var DetachableProcessManager = function(context) {

    if (!context._dpm) { context._dpm = []; }

    return {
        attachProcess : function(detachedProcess) {
            context._dpm.push(detachedProcess);
        },

        runProcesses : function(error, data) {
            _.each(context._dpm, function(detachedProcess) {
                detachedProcess(error, data, context);
            });
        }
    };

};

module.exports = DetachableProcessManager;
