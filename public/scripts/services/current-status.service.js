angular
    .module('app.myPortfolio')
    .service('CurrentStatusService', CurrentStatusService);
CurrentStatusService.$inject = ['$http', '$q'];

function CurrentStatusService($http, $q) {

    var service = this;

    service.getCurrentstatusData = function(userId) {
        var deferred = $q.defer();
        return $http.get("/currentStatus/" + userId)
            .then(function(response) {
                deferred.resolve(response.data);
                return deferred.promise;
            }, function(response) {
                deferred.reject(response);
                return deferred.promise;
            });
    }

    service.updateCurrentStatusData = function(currentStatusData) {
        var deferred = $q.defer();
        return $http.put("/currentStatus/", {
                "currentStatusData": currentStatusData
            })
            .then(function(response) {
                deferred.resolve(response.data);
                return deferred.promise;
            }, function(response) {
                deferred.reject(response);
                return deferred.promise;
            });
    }
    return service;
}
