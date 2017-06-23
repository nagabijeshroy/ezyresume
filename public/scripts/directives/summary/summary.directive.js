angular
    .module('app.myPortfolio')
    .directive('summary', summary);

function summary() {
    var directive = {
        link: link,
        templateUrl: 'scripts/directives/summary/summary.directive.html',
        restrict: 'EA',
        scope: {},
        controller: SummaryController,
        controllerAs: 'vm',
        bindToController: true // because the scope is isolated
    };
    return directive;

    function link(scope, element, attrs) {
    }
}
