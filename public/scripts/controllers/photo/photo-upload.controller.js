angular
    .module("app.myPortfolio")
    .controller("PhotoUploadController", PhotoUploadController);
PortfolioController.$inject = ['$scope', '$state', 'DataService', 'Upload'];

function PhotoUploadController($scope, $state, DataService, Upload) {
    vm = this;
    vm.dataService = DataService;
    vm.uploadFiles = function(file, errFiles) {
        vm.f = file;
        vm.errFile = errFiles && errFiles[0];
        if (file) {
            console.log(file);
            file.upload = Upload.upload({
                url: '/upload-photo/',
                data: {
                    file: file,
                    userId: DataService.userId
                }
            })
            .progress(function(event) {
            }).success(function(data, status, headers, config) {
                console.log("Photo Uploaded");
            }).error(function(err) {
                console.log('Error uploading file: ' + err.message || err);
            });
        }
    };
}
