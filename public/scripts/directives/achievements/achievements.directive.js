angular
    .module('app.myPortfolio')
    .directive('achievements', achievements);

function achievements() {
    var directive = {
        link: link,
        templateUrl: 'scripts/directives/achievements/achievements.directive.html',
        restrict: 'EA',
        scope: {},
        controller: AchievementsController,
        controllerAs: 'vm',
        bindToController: true
    };
    return directive;

    function link(scope, element, attrs) {

    }
}
