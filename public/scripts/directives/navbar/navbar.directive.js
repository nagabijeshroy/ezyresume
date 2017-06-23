angular
    .module('app.myPortfolio')
    .directive('portfolioNavbar', portfolioNavbar);

function portfolioNavbar() {
    var directive = {
        link: link,
        templateUrl: 'scripts/directives/navbar/navbar.directive.html',
        restrict: 'EA'
    };
    return directive;

    function link(scope, element, attrs) {
        /* */
    }
}
