angular
    .module('app.myPortfolio')
    .controller('SkillsController', SkillsController);
SkillsController.$inject = ['$scope', 'SkillsService', 'DataService', '$uibModal', '$log', '$document'];

function SkillsController($scope, SkillsService, DataService, $uibModal, $log, $document) {
    var vm = this;
    vm.dataService = DataService;
    vm.status = {
        isCollapsed: false,
        isEmpty: false
    }

    vm.getSkillsData = function(userId) {
        if (!userId) {
            userId = vm.dataService.userId;
        }
        SkillsService.getSkillsData(userId)
            .then(
                function(data) {
                    vm.skillsData = data;
                    vm.status.isEmpty = $.isEmptyObject(vm.skillsData);
                },
                function(error) {
                    console.log(error.statusText);
                }
            );
    }

    vm.getSkillsData();

    vm.status.isEmpty = $.isEmptyObject(vm.skillsData);

    vm.updateSkillsData = function(skillsData) {
        SkillsService.updateSkillsData(skillsData)
            .then(
                function(data) {
                    vm.skillsData = data;
                    vm.status.isEmpty = $.isEmptyObject(vm.skillsData);
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
            templateUrl: '/scripts/directives/widgets/modals/skills.modal.html',
            controller: 'SkillsModalInstanceCtrl',
            controllerAs: 'vm',
            size: 'lg',
            resolve: {
                skillsData: function() {
                    return vm.skillsData;
                }
            }
        });

        modalInstance.result.then(function() {
            vm.updateSkillsData(vm.skillsData);
            vm.getSkillsData();
        }, function(text) {
            $log.info('Modal dismissed at: ' + new Date());
            vm.getSkillsData();
        });
    }
}

angular
    .module('app.myPortfolio')
    .controller('SkillsModalInstanceCtrl', function($uibModalInstance, skillsData) {
        var vm = this;
        vm.skillsData = skillsData;

        vm.addSkillsItem = function() {
            vm.skillsData.skillsList.push("");
        }
        vm.removeSkillsItem = function(index) {
            vm.skillsData.skillsList.splice(index, 1);
        }

        vm.addTag = function() {
            vm.skillsData.tags.push({
                id: 1,
                word: '',
                size: '1'
            });
        }

        vm.removeTag = function(index) {
            vm.skillsData.tags.splice(index, 1);
        }

        vm.ok = function() {
            $uibModalInstance.close();
        };

        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    });
