angular
    .module('app.myPortfolio')
    .controller('ProjectsController', ProjectsController);
ProjectsController.$inject = ['$scope', 'ProjectsService', 'DataService', '$uibModal', '$log', '$document'];

function ProjectsController($scope, ProjectsService, DataService, $uibModal, $log, $document) {
    var vm = this;
    vm.dataService = DataService;
    vm.status = {
        isCollapsed: false
    }

    vm.getProjectsData = function(userId) {
      if (!userId) {
          userId = vm.dataService.userId;
      }
        ProjectsService.getProjectsData(userId)
            .then(
                function(data) {
                    vm.projectsData = data;
                },
                function(error) {
                    console.log(error.statusText);
                }
            );
    }

    vm.addProjectsData = function(userId, projectsListItem) {
        ProjectsService.addProjectsData(userId, projectsListItem)
            .then(
                function(data) {
                    vm.getProjectsData(userId);
                },
                function(error) {
                    console.log(error.statusText);
                }
            );
    }

    vm.updateProjectsData = function(userId, projectsListItem) {
        ProjectsService.updateProjectsData(userId, projectsListItem)
            .then(
                function(data) {
                    vm.getProjectsData(userId);
                },
                function(error) {
                    console.log(error.statusText);
                }
            );
    }

    vm.deleteProjectsData = function(userId, projectsListItemId) {
        ProjectsService.deleteProjectsData(userId, projectsListItemId)
            .then(
                function(data) {
                    vm.getProjectsData(userId);
                },
                function(error) {
                    console.log(error.statusText);
                }
            );
    }

    vm.getProjectsData();

    vm.open = function(userId, action, index) {
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '/scripts/directives/widgets/modals/projects.modal.html',
            controller: 'ProjectsModalInstanceCtrl',
            controllerAs: 'vm',
            size: 'lg',
            resolve: {
                projectsListItem: function() {
                    if (index != -1) {
                        return vm.projectsData.projectsList[index];
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
                vm.addProjectsData(userId, data);
            } else if (action == 2) {
                vm.updateProjectsData(userId, data);
            } else if (action == 3) {
              console.log(data);
                vm.deleteProjectsData(userId, data);
            }
            vm.getProjectsData();
        }, function(text) {
            $log.info('Modal dismissed at: ' + new Date());
            vm.getProjectsData();
        });
    }
}

angular
    .module('app.myPortfolio')
    .controller('ProjectsModalInstanceCtrl', function($uibModalInstance, projectsListItem, action) {
        var vm = this;
        if (action == 1) {
            vm.projectsData = {
                projectsList: {
                  institution: {
                      name: '',
                      city: '',
                      state: ''
                  },
                  project: {
                      projectName: '',
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
            vm.projectsData = {
                projectsList: projectsListItem
            }
        } else if (action == 3) {
            vm.action = 'delete';
            vm.projectsData = {
                projectsList: projectsListItem
            }
        }

        vm.addResponsibility = function() {
            vm.projectsData.projectsList.project.responsibilities.push("");
        }
        vm.removeResponsibility = function(index) {
            vm.projectsData.projectsList.project.responsibilities.splice(index, 1);
        }
        vm.ok = function() {
            $uibModalInstance.close(vm.projectsData);
        };

        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    });
