angular
    .module('app.myPortfolio')
    .service('DataService', DataService);

function DataService() {

    var service = this;
    service.isLoggedIn = false;
    service.userId = null;
    return service;
}
