angular
    .module('app.myPortfolio')
    .controller('SummaryController', SummaryController);
SummaryController.$inject = ['$scope', 'SummaryService', 'DataService', '$uibModal', '$log', '$document'];

function SummaryController($scope, SummaryService, DataService, $uibModal, $log, $document) {
    var vm = this;
    vm.dataService = DataService;
    vm.status = {
        isCollapsed: false,
        isEmpty: false
    }
    vm.getSummaryData = function(userId) {
        if (!userId) {
            userId = vm.dataService.userId;
        }
        SummaryService.getSummaryData(userId)
            .then(
                function(data) {
                    vm.summaryData = data;
                    vm.status.isEmpty = $.isEmptyObject(vm.summaryData);
                },
                function(error) {
                    console.log(error.statusText);
                }
            );
    }

    vm.getSummaryData();

    vm.status.isEmpty = $.isEmptyObject(vm.summaryData);

    vm.updateSummaryData = function(summaryData) {
        SummaryService.updateSummaryData(summaryData)
            .then(
                function(data) {
                    vm.summaryData = data;
                    vm.status.isEmpty = $.isEmptyObject(vm.summaryData);
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
            templateUrl: '/scripts/directives/widgets/modals/summary.modal.html',
            controller: 'SummaryModalInstanceCtrl',
            controllerAs: 'vm',
            size: 'lg',
            resolve: {
                summaryData: function() {
                    return vm.summaryData;
                }
            }
        });

        modalInstance.result.then(function() {
            vm.updateSummaryData(vm.summaryData);
            vm.getSummaryData();
        }, function(text) {
            $log.info('Modal dismissed at: ' + new Date());
            vm.getSummaryData();
        });
    }
}

angular
    .module('app.myPortfolio')
    .controller('SummaryModalInstanceCtrl', function($uibModalInstance, summaryData) {
        var vm = this;
        vm.summaryData = summaryData;

        vm.addSummaryItem = function() {
            vm.summaryData.descriptionList.push("");
        }
        vm.removeSummaryItem = function(index) {
            vm.summaryData.descriptionList.splice(index, 1);
        }
        vm.ok = function() {
            $uibModalInstance.close();
        };

        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    });
