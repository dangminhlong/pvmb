define(["app-config"], function (app) {
    app.register.controller("quanlynoController", ["$scope", "$rootScope", "$routeParams", "$http", "$uibModal", function ($scope, $rootScope, $routeParams, $http, $uibModal) {
        $scope.initController = function () {
            $rootScope.title = 'QUẢN LÝ NỢ';
            $scope.layDsThanhVien();
            $scope.xemDsNo();
        }
        
        $scope.xemDsNo = function(){
            $http.post('/quanlyno').then(function(resp){
               $scope.dsNo =  resp.data;
            });
        }
        
        $scope.layDsThanhVien = function () {
            $http.post('/thanhvien').then(function (resp) {
                $scope.dsCTV = resp.data;
            });
        };

        $scope.chonNo = function (no) {
            $scope.no = $.extend({}, no);
            for (var i = 0; i < $scope.dsNo.length; i++) {
                $scope.dsNo[i].selected = '';
            }
            no.selected = 'danger';
        }
        
        $scope.themno = function(){
            var data = $.extend({}, $scope.no);
            if (data.ctv){
                delete data.ctv["dienthoai"];
                delete data.ctv["diachi"];
                delete data.ctv["matheVIP"];
                delete data.ctv["diemVIP"];
                delete data.ctv["diemthuong"];
                delete data.ctv["chietkhau"];
                delete data.ctv["loaithanhvien"];
                delete data.ctv["khuvuc"];
            }
            $http.post("/quanlyno/themno", data).then(function(resp){
                $scope.dsNo = resp.data.data;
            });
        }
        
        $scope.giamno = function(){
            var data = $.extend({}, $scope.no);
            if (data.ctv){
                delete data.ctv["dienthoai"];
                delete data.ctv["diachi"];
                delete data.ctv["matheVIP"];
                delete data.ctv["diemVIP"];
                delete data.ctv["diemthuong"];
                delete data.ctv["chietkhau"];
                delete data.ctv["loaithanhvien"];
            }
            $http.post("/quanlyno/giamno", data).then(function(resp){
                $scope.dsNo = resp.data.data;
            });
        }
        
        $scope.chitiet = function(){
            if ($scope.no.ctv){
                $rootScope.ctv_id=$scope.no.ctv._id;
                var modalInstance = $uibModal.open({
                    templateUrl: 'chitietnoTemplate.html',
                    controller: 'chitietnoController',
                    size: 'lg'
                });

                modalInstance.result.then(function (data) {

                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            }
        }
    }]);

    app.register.controller("chitietnoController", ["$scope", "$rootScope", "$routeParams", "$http", "$uibModalInstance", "$timeout", function ($scope, $rootScope, $routeParams, $http, $uibModalInstance, $timeout) {
        $scope.ctv_id = $rootScope.ctv_id;
        $scope.dsChiTietNo = [];
        $scope.initController = function () {
            $scope.xemDsChiTietNo();
        }
        $scope.xemDsChiTietNo = function(){
            var data = {ctv_id : $scope.ctv_id};
            $http.post('/quanlyno/chitiet', data).then(function(response){
                $scope.dsChiTietNo = response.data;
            });
        }
        $scope.excel = function(){
            var data = {ctv_id : $scope.ctv_id};
            $http.post('/quanlyno/excelchitiet', data, { responseType: 'arraybuffer' }).then(function(response){
                var blob = new Blob([response.data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                });
                saveAs(blob, "chitiet.xlsx");
            });
        }
        $scope.cancel = function(){
            $uibModalInstance.dismiss('cancel');
        }
    }]);
});