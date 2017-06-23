angular
    .module('app.myPortfolio')
    .service('AchievementsService', AchievementsService);

AchievementsService.$inject = ['$http', '$q'];

function AchievementsService($http, $q) {

    var service = this;

    service.getAchievementsData = function(userId) {
        var deferred = $q.defer();
        return $http.get("/achievements/"+ userId)
            .then(function(response) {
                deferred.resolve(response.data);
                return deferred.promise;
            }, function(response) {
                deferred.reject(response);
                return deferred.promise;
            });
    }

    service.updateAchievementsData = function(achievementsData) {
        var deferred = $q.defer();
        return $http.put("/achievements/", {
                "achievementsData": achievementsData
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
