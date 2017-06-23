angular
    .module('app.myPortfolio')
    .controller('EducationController', EducationController);
EducationController.$inject = ['$scope', 'EducationService', 'DataService', '$uibModal', '$log', '$document'];

function EducationController($scope, EducationService, DataService, $uibModal, $log, $document) {
    var vm = this;
    vm.dataService = DataService;
    vm.status = {
        isCollapsed: false,
    }
    vm.getEducationData = function(userId) {
        if (!userId) {
            userId = vm.dataService.userId;
        }
        EducationService.getEducationData(userId)
            .then(
                function(data) {
                    vm.educationData = data;
                },
                function(error) {
                    console.log(error.statusText);
                }
            );
    }

    vm.addEducationData = function(userId, educationListItem) {
        EducationService.addEducationData(userId, educationListItem)
            .then(
                function(data) {
                    vm.getEducationData(userId);
                },
                function(error) {
                    console.log(error.statusText);
                }
            );
    }

    vm.updateEducationData = function(userId, educationListItem) {
        EducationService.updateEducationData(userId, educationListItem)
            .then(
                function(data) {
                    vm.getEducationData(userId);
                },
                function(error) {
                    console.log(error.statusText);
                }
            );
    }

    vm.deleteEducationData = function(userId, educationListItemId) {
        EducationService.deleteEducationData(userId, educationListItemId)
            .then(
                function(data) {
                    vm.getEducationData(userId);
                },
                function(error) {
                    console.log(error.statusText);
                }
            );
    }

    vm.getEducationData();

    vm.open = function(userId, action, index) {
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '/scripts/directives/widgets/modals/education.modal.html',
            controller: 'EducationModalInstanceCtrl',
            controllerAs: 'vm',
            size: 'lg',
            resolve: {
                educationListItem: function() {
                    if (index != -1) {
                        return vm.educationData.educationList[index];
                    } else {
                        return null;
                    }
                },
                action: action
            }
        });

        modalInstance.result.then(function(data) {
            //action 1 for add,  2 for edit and 3 for delete
            if (action == 1) {
                vm.addEducationData(userId, data);
            } else if (action == 2) {
                vm.updateEducationData(userId, data);
            } else if (action == 3) {
              console.log(data);
                vm.deleteEducationData(userId, data);
            }
            vm.getEducationData();
        }, function(text) {
            $log.info('Modal dismissed at: ' + new Date());
            vm.getEducationData();
        });
    }

}

angular
    .module('app.myPortfolio')
    .controller('EducationModalInstanceCtrl', function($uibModalInstance, educationListItem, action) {
        var vm = this;
        if (action == 1) {
            vm.educationData = {
                educationList: {
                    institution: {
                        name: '',
                        city: '',
                        state: ''
                    },
                    course: {
                        degreeName: '',
                        gpa: '',
                        courseList: ['']
                    },
                    duration: {
                        from: {
                            month: '',
                            year: ''
                        },
                        to: {
                            month: '',
                            year: ''
                        }
                    },
                    isCollapsed: true,
                }
            }
        } else if (action == 2) {
            vm.educationData = {
                educationList: educationListItem
            }
        } else if (action == 3) {
            vm.action = 'delete';
            vm.educationData = {
                educationList: educationListItem
            }
        }

        vm.addCourseName = function() {
            vm.educationData.educationList.course.courseList.push("");
        }
        vm.removeCourseName = function(index) {
            vm.educationData.educationList.course.courseList.splice(index, 1);
        }
        vm.ok = function() {
            $uibModalInstance.close(vm.educationData);
        };

        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    });
