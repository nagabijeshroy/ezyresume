angular
    .module('app.myPortfolio')
    .directive('objective', objective);

function objective() {
    var directive = {
        link: link,
        templateUrl: 'scripts/directives/objective/objective.directive.html',
        restrict: 'EA',
        scope: {},
        controller: ObjectiveController,
        controllerAs: 'vm',
        bindToController: true
    };
    return directive;

    function link(scope, element, attrs) {
    }
}
