angular
    .module('app.myPortfolio')
    .service('UserService', UserService);

UserService.$inject = ['$http', '$q'];

function UserService($http, $q) {

    var service = this;

    service.getUserData = function(userId) {
        var deferred = $q.defer();
        return $http.get("/user/"+ userId)
            .then(function(response) {
                deferred.resolve(response.data);
                return deferred.promise;
            }, function(response) {
                deferred.reject(response);
                return deferred.promise;
            });
    }

    service.updateUserData = function(userData) {
        var deferred = $q.defer();
        return $http.put("/user/", {
                "userData": userData
            })
            .then(function(response) {
                deferred.resolve(response.data);
                return deferred.promise;
            }, function(response) {
                deferred.reject(response);
                return deferred.promise;
            });
    }

    service.createUserData = function(userData){
      var deferred = $q.defer();
      return $http.post("/user/", {
              "userData": userData
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
