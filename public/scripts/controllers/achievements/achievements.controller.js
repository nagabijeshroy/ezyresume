angular
    .module('app.myPortfolio')
    .controller('AchievementsController', AchievementsController);
AchievementsController.$inject = ['$scope', 'AchievementsService', 'DataService', '$uibModal', '$log', '$document'];

function AchievementsController($scope, AchievementsService, DataService, $uibModal, $log, $document) {
    var vm = this;
    vm.dataService = DataService;
    vm.status = {
        isCollapsed: false,
        isEmpty: false
    }
    vm.getAchievementsData = function(userId) {
        if (!userId) {
            userId = vm.dataService.userId;
        }
        AchievementsService.getAchievementsData(userId)
            .then(
                function(data) {
                    vm.achievementsData = data;
                    vm.status.isEmpty = $.isEmptyObject(vm.achievementsData);
                },
                function(error) {
                    console.log(error.statusText);
                }
            );
    }

    vm.getAchievementsData();

    vm.status.isEmpty = $.isEmptyObject(vm.achievementsData);

    vm.updateAchievementsData = function(achievementsData) {
        AchievementsService.updateAchievementsData(achievementsData)
            .then(
                function(data) {
                    vm.achievementsData = data;
                    vm.status.isEmpty = $.isEmptyObject(vm.achievementsData);
                },
                function(error) {
                    console.log(error.statusText);
                }
            );
    }

    vm.open = function(userId) {
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '/scripts/directives/widgets/modals/achievements.modal.html',
            controller: 'AchievementsModalInstanceCtrl',
            controllerAs: 'vm',
            size: 'lg',
            resolve: {
                achievementsData: function() {
                    return vm.achievementsData;
                }
            }
        });

        modalInstance.result.then(function() {
            vm.updateAchievementsData(vm.achievementsData);
            vm.getAchievementsData();
        }, function(text) {
            $log.info('Modal dismissed at: ' + new Date());
            vm.getAchievementsData();
        });
    }
}
angular
    .module('app.myPortfolio')
    .controller('AchievementsModalInstanceCtrl', function($uibModalInstance, achievementsData) {
        var vm = this;
        vm.achievementsData = achievementsData;

        vm.addAchievementsItem = function() {
            vm.achievementsData.achievementsList.push("");
        }
        vm.removeAchievementsItem = function(index) {
            vm.achievementsData.achievementsList.splice(index, 1);
        }
        vm.ok = function() {
            $uibModalInstance.close();
        };

        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    });
