angular
    .module('app.myPortfolio')
    .directive('education', education);

function education() {
    var directive = {
        link: link,
        templateUrl: 'scripts/directives/education/education.directive.html',
        restrict: 'EA',
        scope: {},
        controller: EducationController,
        controllerAs: 'vm',
        bindToController: true
    };
    return directive;

    function link(scope, element, attrs) {

    }
}
