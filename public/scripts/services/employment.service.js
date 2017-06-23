angular
    .module('app.myPortfolio')
    .service('EmploymentService', EmploymentService);
EmploymentService.$inject = ['$http', '$q']

function EmploymentService($http, $q) {

    var service = this;

    service.getEmploymentData = function(userId) {
        var deferred = $q.defer();
        return $http.get("/employment/"+ userId)
            .then(function(response) {
                deferred.resolve(response.data);
                return deferred.promise;
            }, function(response) {
                deferred.reject(response);
                return deferred.promise;
            });
    }


    service.addEmploymentData = function(userId, employmentListItem) {
        var deferred = $q.defer();
        return $http.post("/employment", {
                userId: userId,
                employmentListItem: employmentListItem
            })
            .then(function(response) {
                deferred.resolve(response.data);
                return deferred.promise;
            }, function(response) {
                deferred.reject(response);
                return deferred.promise;
            });
    }

    service.updateEmploymentData = function(userId, employmentListItem) {
        var deferred = $q.defer();
        return $http.put("/employment", {
                userId: userId,
                employmentListItem: employmentListItem
            })
            .then(function(response) {
                deferred.resolve(response.data);
                return deferred.promise;
            }, function(response) {
                deferred.reject(response);
                return deferred.promise;
            });
    }

    service.deleteEmploymentData = function(userId, employmentListItem) {
        var deferred = $q.defer();
        return $http({
                method: 'DELETE',
                url: "/employment",
                data: {
                    userId: userId,
                    employmentListItem: employmentListItem
                },
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            })
            .then(function(response) {
                deferred.resolve(response.data);
                return deferred.promise;
            }, function(response) {
                deferred.reject(response);
                return deferred.promise;
            });
    }
}
