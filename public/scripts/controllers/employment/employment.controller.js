angular
    .module('app.myPortfolio')
    .controller('EmploymentController', EmploymentController);
EmploymentController.$inject = ['$scope', 'EmploymentService', 'DataService', '$uibModal', '$log', '$document'];

function EmploymentController($scope, EmploymentService, DataService, $uibModal, $log, $document) {
    var vm = this;
    vm.dataService = DataService;
    vm.status = {
        isCollapsed: false
    }

    vm.getEmploymentData = function(userId) {
      if (!userId) {
          userId = vm.dataService.userId;
      }
        EmploymentService.getEmploymentData(userId)
            .then(
                function(data) {
                    vm.employmentData = data;
                },
                function(error) {
                    console.log(error.statusText);
                }
            );
    }

    vm.addEmploymentData = function(userId, employmentListItem) {
        EmploymentService.addEmploymentData(userId, employmentListItem)
            .then(
                function(data) {
                    vm.getEmploymentData(userId);
                },
                function(error) {
                    console.log(error.statusText);
                }
            );
    }

    vm.updateEmploymentData = function(userId, employmentListItem) {
        EmploymentService.updateEmploymentData(userId, employmentListItem)
            .then(
                function(data) {
                    vm.getEmploymentData(userId);
                },
                function(error) {
                    console.log(error.statusText);
                }
            );
    }

    vm.deleteEmploymentData = function(userId, employmentListItemId) {
        EmploymentService.deleteEmploymentData(userId, employmentListItemId)
            .then(
                function(data) {
                    vm.getEmploymentData(userId);
                },
                function(error) {
                    console.log(error.statusText);
                }
            );
    }

    vm.getEmploymentData();

    vm.open = function(userId, action, index) {
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '/scripts/directives/widgets/modals/employment.modal.html',
            controller: 'EmploymentModalInstanceCtrl',
            controllerAs: 'vm',
            size: 'lg',
            resolve: {
                employmentListItem: function() {
                    if (index != -1) {
                        return vm.employmentData.employmentList[index];
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
                vm.addEmploymentData(userId, data);
            } else if (action == 2) {
                vm.updateEmploymentData(userId, data);
            } else if (action == 3) {
              console.log(data);
                vm.deleteEmploymentData(userId, data);
            }
            vm.getEmploymentData();
        }, function(text) {
            $log.info('Modal dismissed at: ' + new Date());
            vm.getEmploymentData();
        });
    }
}

angular
    .module('app.myPortfolio')
    .controller('EmploymentModalInstanceCtrl', function($uibModalInstance, employmentListItem, action) {
        var vm = this;
        if (action == 1) {
            vm.employmentData = {
                employmentList: {
                  company: {
                      name: '',
                      city: '',
                      state: ''
                  },
                  job: {
                      jobName: '',
                      responsibilities: ['']
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
            vm.employmentData = {
                employmentList: employmentListItem
            }
        } else if (action == 3) {
            vm.action = 'delete';
            vm.employmentData = {
                employmentList: employmentListItem
            }
        }

        vm.addResponsibility = function() {
            vm.employmentData.employmentList.job.responsibilities.push("");
        }
        vm.removeResponsibility = function(index) {
            vm.employmentData.employmentList.job.responsibilities.splice(index, 1);
        }
        vm.ok = function() {
            $uibModalInstance.close(vm.employmentData);
        };

        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    });
