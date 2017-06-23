angular
    .module('app.myPortfolio')
    .service('SummaryService', SummaryService);

SummaryService.$inject = ['$http', '$q'];

function SummaryService($http, $q) {

    var service = this;

    service.getSummaryData = function(userId) {
        var deferred = $q.defer();
        return $http.get("/summary/"+ userId)
            .then(function(response) {
                deferred.resolve(response.data);
                return deferred.promise;
            }, function(response) {
                deferred.reject(response);
                return deferred.promise;
            });
    }

    service.updateSummaryData = function(summaryData) {
        var deferred = $q.defer();
        return $http.put("/summary/", {
                "summaryData": summaryData
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
