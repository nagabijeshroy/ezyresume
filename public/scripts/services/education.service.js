angular
    .module('app.myPortfolio')
    .service('EducationService', EducationService);

EducationService.$inject = ['$http', '$q']

function EducationService($http, $q) {

    var service = this;

    service.getEducationData = function(userId) {
        var deferred = $q.defer();
        return $http.get("/education/" + userId)
            .then(function(response) {
                deferred.resolve(response.data);
                return deferred.promise;
            }, function(response) {
                deferred.reject(response);
                return deferred.promise;
            });
    }

    service.addEducationData = function(userId, educationListItem) {
        var deferred = $q.defer();
        return $http.post("/education", {
                userId: userId,
                educationListItem: educationListItem
            })
            .then(function(response) {
                deferred.resolve(response.data);
                return deferred.promise;
            }, function(response) {
                deferred.reject(response);
                return deferred.promise;
            });
    }

    service.updateEducationData = function(userId, educationListItem) {
        var deferred = $q.defer();
        return $http.put("/education", {
                userId: userId,
                educationListItem: educationListItem
            })
            .then(function(response) {
                deferred.resolve(response.data);
                return deferred.promise;
            }, function(response) {
                deferred.reject(response);
                return deferred.promise;
            });
    }

    service.deleteEducationData = function(userId, educationListItem) {
        var deferred = $q.defer();
        return $http({
                method: 'DELETE',
                url: "/education",
                data: {
                    userId: userId,
                    educationListItem: educationListItem
                },
                headers: {'Content-Type': 'application/json;charset=utf-8'}
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
