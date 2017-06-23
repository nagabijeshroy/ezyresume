angular
    .module('app.myPortfolio')
    .service('ProjectsService', ProjectsService);
ProjectsService.$inject = ['$http', '$q']

function ProjectsService($http, $q) {

    var service = this;

    service.getProjectsData = function(userId) {
        var deferred = $q.defer();
        return $http.get("/projects/"+ userId)
            .then(function(response) {
                deferred.resolve(response.data);
                return deferred.promise;
            }, function(response) {
                deferred.reject(response);
                return deferred.promise;
            });
    }


    service.addProjectsData = function(userId, projectsListItem) {
        var deferred = $q.defer();
        return $http.post("/projects", {
                userId: userId,
                projectsListItem: projectsListItem
            })
            .then(function(response) {
                deferred.resolve(response.data);
                return deferred.promise;
            }, function(response) {
                deferred.reject(response);
                return deferred.promise;
            });
    }

    service.updateProjectsData = function(userId, projectsListItem) {
        var deferred = $q.defer();
        return $http.put("/projects", {
                userId: userId,
                projectsListItem: projectsListItem
            })
            .then(function(response) {
                deferred.resolve(response.data);
                return deferred.promise;
            }, function(response) {
                deferred.reject(response);
                return deferred.promise;
            });
    }

    service.deleteProjectsData = function(userId, projectsListItem) {
        var deferred = $q.defer();
        return $http({
                method: 'DELETE',
                url: "/projects",
                data: {
                    userId: userId,
                    projectsListItem: projectsListItem
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
