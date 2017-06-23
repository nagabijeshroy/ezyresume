angular
    .module('app.myPortfolio')
    .service('LandingPageService', LandingPageService);

LandingPageService.$inject = ['$http', '$q'];

function LandingPageService($http, $q) {

    var service = this;
    
    return service;
}
