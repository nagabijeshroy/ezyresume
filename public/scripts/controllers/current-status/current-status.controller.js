angular
    .module('app.myPortfolio')
    .controller('CurrentStatusController', CurrentStatusController);
CurrentStatusController.$inject = ['$scope', 'CurrentStatusService', 'DataService', '$uibModal', '$log', '$document'];

function CurrentStatusController($scope, CurrentStatusService, DataService, $uibModal, $log, $document) {
    var vm = this;
    vm.dataService = DataService;
    vm.status = {
        isEmpty: false
    }

    vm.getCurrentstatusData = function(userId) {
      if(!userId){
        userId = vm.dataService.userId;
      }
        CurrentStatusService.getCurrentstatusData(userId)
            .then(
                function(data) {
                    vm.currentStatusData = data;
                    vm.status.isEmpty = $.isEmptyObject(vm.currentStatusData);
                },
                function(error) {
                    console.log(error.statusText);
                }
            );
    }

    vm.status.isEmpty = $.isEmptyObject(vm.currentStatusData);

    vm.updateCurrentStatusData = function(currentStatusData) {
        CurrentStatusService.updateCurrentStatusData(currentStatusData)
            .then(
                function(data) {
                    vm.currentStatusData = data;
                    vm.status.isEmpty = $.isEmptyObject(vm.currentStatusData);
                },
                function(error) {
                    console.log(error.statusText);
                }
            );
    }

    vm.getCurrentstatusData();

    vm.open = function(userId) {
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '/scripts/directives/widgets/modals/current-status.modal.html',
            controller: 'CurrentStatusModalInstanceCtrl',
            controllerAs: 'vm',
            size: 'lg',
            resolve: {
                currentStatusData: function() {
                    return vm.currentStatusData;
                }
            }
        });

        modalInstance.result.then(function() {
            vm.updateCurrentStatusData(vm.currentStatusData);
            vm.getCurrentstatusData();
        }, function(text) {
            $log.info('Modal dismissed at: ' + new Date());
            vm.getCurrentstatusData();
        });
    }

}

angular
    .module('app.myPortfolio')
    .controller('CurrentStatusModalInstanceCtrl', function($uibModalInstance, currentStatusData) {
        var vm = this;
        vm.currentStatusData = currentStatusData;

        vm.ok = function() {
            $uibModalInstance.close();
        };

        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    });
