angular
    .module('app.myPortfolio')
    .config(config);

function config($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: 'scripts/resources/views/landing-page/landing-page.html'
        })

        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('profile', {
          url: '/profile',
          templateUrl: 'scripts/resources/views/portfolio-content/portfolio.html'
        });
}
