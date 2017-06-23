angular
    .module('app.myPortfolio')
    .service('ObjectiveService', ObjectiveService);

ObjectiveService.$inject = ['$http', '$q'];

function ObjectiveService($http, $q) {
    var service = this;
    service.getObjectiveData = function(userId) {
        var deferred = $q.defer();
        return $http.get("/objective/" + userId)
            .then(function(response) {
                deferred.resolve(response.data);
                return deferred.promise;
            }, function(response) {
                deferred.reject(response);
                return deferred.promise;
            });
    }

    service.updateObjectiveData = function(objectiveData) {
        var deferred = $q.defer();
        return $http.put("/objective/", {
                "objectiveData": objectiveData
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
