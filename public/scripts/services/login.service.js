angular
    .module('app.myPortfolio')
    .service('LoginService', LoginService);

LoginService.$inject = ['$http', '$q', '$window', 'authentication'];

function LoginService($http, $q, $window, authentication) {

    var service = this;

    service.findLogin = function(loginData) {
        var deferred = $q.defer();
        return $http.post("/login", {
                "username": loginData.username,
                "password": loginData.password
            })
            .then(function(response) {
                deferred.resolve(response.data);
                return deferred.promise;
            }, function(response) {
                deferred.reject(response);
                return deferred.promise;
            });
    }

    service.isLoggedIn = function() {
        var token = authentication.getToken();
        var payload;

        if (token) {
            payload = token.split('.')[1];
            payload = $window.atob(payload);
            payload = JSON.parse(payload);

            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    };

    service.currentUser = function() {
        if (service.isLoggedIn()) {
            var token = authentication.getToken();
            var payload = token.split('.')[1];
            payload = $window.atob(payload);
            payload = JSON.parse(payload);
            return {
                userId: payload.userId
            };
        }
    };
    return service;
}
