angular
  .module("app.myPortfolio")
  .controller("PortfolioController",PortfolioController);
PortfolioController.$inject = ['$scope', '$state', 'DataService'];
  function PortfolioController($scope, $state, DataService){
    //console.log($state);
    vm = this;
    vm.dataService = DataService;
    if(!vm.dataService.isLoggedIn){
      $state.go('home');
    }
  }
