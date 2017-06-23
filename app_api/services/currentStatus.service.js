var Q = require("q");
var currentStatus = require('../models/currentStatus');

var getCurrentStatusById = function(userId) {

    var deferred = Q.defer();
    currentStatus.findOne({
        userId: userId
    }, function(error, currentStatus) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve(currentStatus);
        }
    });
    return deferred.promise;
}

var updateCurrentStatusData = function(currentStatusData) {
    var deferred = Q.defer();
    currentStatus.findOne({
        userId: currentStatusData.userId
    }, function(error, currentStatus) {
        if (error) {

        } else {
            currentStatus.jobName = currentStatusData.jobName;
            currentStatus.client = currentStatusData.client;
            currentStatus.employer = currentStatusData.employer;
            currentStatus.save(function(err, updatedCurrentStatus) {
                if (err) {
                    deferred.reject(new Error(error));
                } else {
                    deferred.resolve(updatedCurrentStatus);
                }
            });
        }
    });
    return deferred.promise;
}

var createCurrentStatusData = function(userId) {
    var deferred = Q.defer();
    var currentStatusData = new currentStatus({
        userId: userId,
        jobName: 'Job Name',
        client: {
            name: 'Company Name',
            city: 'City',
            state: 'State'
        },
        employer: {
            name: 'Company Name',
            city: 'City',
            state: 'State'
        }
    });
    currentStatusData.save(function(err, currentStatus) {
        if (err) {
            console.log('Error creating currentStatus');
            deferred.reject(new Error(err));
        } else if (currentStatus) {
            deferred.resolve(currentStatus);
        }
    });

    return deferred.promise;
}

var currentStatusService = {
    getCurrentStatusById: getCurrentStatusById,
    updateCurrentStatusData: updateCurrentStatusData,
    createCurrentStatusData: createCurrentStatusData
}

module.exports = currentStatusService
