angular
    .module('app.myPortfolio')
    .service('SkillsService', SkillsService);

SkillsService.$inject = ['$http', '$q'];

function SkillsService($http, $q) {

    var service = this;

    service.getSkillsData = function(userId) {
        var deferred = $q.defer();
        return $http.get("/skills/"+ userId)
            .then(function(response) {
                deferred.resolve(response.data);
                return deferred.promise;
            }, function(response) {
                deferred.reject(response);
                return deferred.promise;
            });
    }
    service.updateSkillsData = function(skillsData) {
        var deferred = $q.defer();
        return $http.put("/skills/", {
                "skillsData": skillsData
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
