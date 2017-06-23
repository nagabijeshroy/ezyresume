angular
    .module('app.myPortfolio')
    .controller('LandingPageController', LandingPageController);
LandingPageController.$inject = ['$scope', 'LandingPageService', 'UserService', 'DataService', 'LoginService', 'authentication', '$uibModal', '$log', '$document', '$state', '$timeout'];

function LandingPageController($scope, LandingPageService, UserService, DataService, LoginService, authentication, $uibModal, $log, $document, $state, $timeout) {
    var vm = this;
    vm.dataService = DataService;
    vm.dataService.isLoggedIn = LoginService.isLoggedIn();
    if (LoginService.isLoggedIn()) {
        vm.dataService.userId = LoginService.currentUser().userId;
    }
    vm.open = function(action) {
        var templateUrl;
        var size;
        if (action == 1) {
            templateUrl = '/scripts/resources/views/landing-page/login.modal.html';
            size = 'md';
        } else if (action == 2) {
            templateUrl = '/scripts/resources/views/landing-page/signup.modal.html';
            size = 'md';
        }
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: templateUrl,
            controller: 'LandingPageModalInstanceCtrl',
            controllerAs: 'vm',
            size: size,
            resolve: {

            }
        });

        modalInstance.result.then(function(data) {
            if (data) {
                if (data.userId) {
                    console.log(data.token);
                    authentication.saveToken(data.token);
                    vm.dataService.userId = data.userId;
                    vm.dataService.isLoggedIn = true;
                    $state.go('profile');
                } else {

                }
            }
            console.log('Modal dismissed');
        }, function(text) {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }
}

angular
    .module('app.myPortfolio')
    .controller('LandingPageModalInstanceCtrl', LandingPageModalInstanceCtrl);

LandingPageModalInstanceCtrl.$inject = ['$uibModalInstance', 'UserService', 'LoginService', '$uibModal', '$log', '$document'];

function LandingPageModalInstanceCtrl($uibModalInstance, UserService, LoginService, $uibModal, $log, $document) {

    var vm = this;
    vm.ok = function(text) {
        if (text == 'signup') {
            vm.hasSigUpError = false;
            vm.signUpErrorMessage = "";
            UserService.createUserData(vm.userData)
                .then(
                    function(data) {
                        $uibModalInstance.close(data);
                    },
                    function(error) {
                        vm.hasSigUpError = true;
                        vm.signUpErrorMessage = error.data;
                        console.log(error.statusText);
                        return error;
                    }
                );
        } else if (text == 'login') {
            if (vm.form.loginForm.$valid) {
                vm.loginErrorMessage = "";
                vm.hasLoginError = false;
                LoginService.findLogin(vm.loginData)
                    .then(
                        function(data) {
                            $uibModalInstance.close(data);
                        },
                        function(error) {
                            vm.hasLoginError = true;
                            vm.loginErrorMessage = "Invalid Username or Password."
                            console.log(error);
                            console.log(error.statusText);
                            return error;
                        }
                    );
            }
        }

    };

    vm.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
}
