angular
    .module('app.myPortfolio')
    .directive('skills', skills);

function skills() {
    var directive = {
        link: link,
        templateUrl: 'scripts/directives/skills/skills.directive.html',
        restrict: 'EA',
        scope: {},
        controller: SkillsController,
        controllerAs: 'vm',
        bindToController: true
    };
    return directive;

    function link(scope, element, attrs) {

    }
}

angular
    .module('app.myPortfolio')
    .directive('integer', integer);

function integer() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function(val) {
                return val != null ? parseInt(val, 10) : null;
            });
            ngModel.$formatters.push(function(val) {
                return val != null ? '' + val : null;
            });
        }
    };
}
