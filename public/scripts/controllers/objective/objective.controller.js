angular
    .module('app.myPortfolio')
    .controller('ObjectiveController', ObjectiveController);
ObjectiveController.$inject = ['$scope', 'ObjectiveService', 'DataService', '$uibModal', '$log', '$document'];

function ObjectiveController($scope, ObjectiveService, DataService, $uibModal, $log, $document) {
    var vm = this;
    vm.dataService = DataService;
    vm.status = {
        isEmpty: false
    }

    vm.getObjectiveData = function(userId) {
        if (!userId) {
            userId = vm.dataService.userId;
        }
        ObjectiveService.getObjectiveData(userId)
            .then(
                function(data) {
                    vm.objectiveData = data;
                    vm.status.isEmpty = $.isEmptyObject(vm.objectiveData);
                },
                function(error) {
                    console.log(error.statusText);
                }
            );
    }

    vm.getObjectiveData();

    vm.status.isEmpty = $.isEmptyObject(vm.objectiveData);

    vm.updateObjectiveData = function(objectiveData) {
        ObjectiveService.updateObjectiveData(objectiveData)
            .then(
                function(data) {
                    vm.objectiveData = data;
                    vm.status.isEmpty = $.isEmptyObject(vm.objectiveData);
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
            templateUrl: '/scripts/directives/widgets/modals/objective.modal.html',
            controller: 'ObjectiveModalInstanceCtrl',
            controllerAs: 'vm',
            size: 'lg',
            resolve: {
                objectiveData: function() {
                    return vm.objectiveData;
                }
            }
        });

        modalInstance.result.then(function() {
            vm.updateObjectiveData(vm.objectiveData);
            vm.getObjectiveData();
        }, function(text) {
            $log.info('Modal dismissed at: ' + new Date());
            vm.getObjectiveData();
        });
    }
}

angular
    .module('app.myPortfolio')
    .controller('ObjectiveModalInstanceCtrl', function($uibModalInstance, objectiveData) {
        var vm = this;
        vm.objectiveData = objectiveData;

        vm.addQuote = function() {
            vm.objectiveData.quotes.push({
                description: "",
                author: ""
            });
        }
        vm.removeQuote = function(index) {
            vm.objectiveData.quotes.splice(index, 1);
        }
        vm.ok = function() {
            $uibModalInstance.close();
        };

        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    });
