angular
    .module('app.myPortfolio')
    .directive('employment', employment);

function employment() {
    var directive = {
        link: link,
        templateUrl: 'scripts/directives/employment/employment.directive.html',
        restrict: 'EA',
        scope: {},
        controller: EmploymentController,
        controllerAs: 'vm',
        bindToController: true
    };
    return directive;

    function link(scope, element, attrs) {

    }
}
