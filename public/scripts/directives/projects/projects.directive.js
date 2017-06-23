angular
    .module('app.myPortfolio')
    .directive('projects', projects);

function projects() {
    var directive = {
        link: link,
        templateUrl: 'scripts/directives/projects/projects.directive.html',
        restrict: 'EA',
        scope: {},
        controller: ProjectsController,
        controllerAs: 'vm',
        bindToController: true
    };
    return directive;

    function link(scope, element, attrs) {

    }
}
