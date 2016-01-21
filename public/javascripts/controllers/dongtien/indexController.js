define(["app-config"], function (app) {
    app.register.controller("dongtienController", ["$scope", "$rootScope", "$routeParams", "$http", function ($scope, $rootScope, $routeParams, $http) {
        $scope.initController = function () {
            $rootScope.title = 'QUẢN LÝ DÒNG TIỀN';
            $scope.taiDongDien();
            $scope.dongtien.ngay = new Date();
            $scope.thutrongngay();
            $scope.laydunodau();
        }
        $scope.dongtien = {};
        $scope.dsDongTien = [];
        $scope.popup_ngay = { opened: false };
        $scope.chon_ngay = function () { $scope.popup_ngay.opened = true; }
        $scope.reset = function () {
            $scope.dongtien = {ngay: new Date()};
            $scope.thutrongngay();
            $scope.laydunodau();
        }
        $scope.chonNgay = function () {
            $scope.laydunodau();
            $scope.thutrongngay();
        }
        $scope.laydunodau = function(){
            var data = { ngay: $scope.dongtien.ngay };
            $http.post("/dongtien/dunodau", data).then(function (response) {
                if (response.data){
                    $scope.dongtien.dunodau = response.data.dunocuoi;
                    $scope.nhap_tien();
                }
                else {
                    $scope.dongtien.dunodau = 0
                    $scope.nhap_tien();
                }
            });
        }
        $scope.thutrongngay = function () {
            var data = { ngay: $scope.dongtien.ngay };
            $http.post("/congno/thu", data).then(function (response) {
                if (response.data.data){
                    $scope.dongtien.tongthu = response.data.data.tongthu;
                    $scope.dongtien.thuchitiet = [];
                    $scope.dongtien.thuchitiet.push({'noidung':'Tiền vé','sotien':response.data.data.tongthu});
                    $scope.dongtien.chichitiet = [];
                    $scope.dongtien.chichitiet.push({'noidung':'','sotien':0});
                    $scope.dongtien.tongchi = 0;
                    $scope.nhap_tien();
                }
                else {
                    $scope.dongtien.tongthu = 0;
                    $scope.dongtien.thuchitiet = [];
                    $scope.dongtien.thuchitiet.push({'noidung':'Tiền vé','sotien':0});
                    $scope.dongtien.chichitiet = [];
                    $scope.dongtien.chichitiet.push({'noidung':'','sotien':0});
                    $scope.dongtien.tongchi = 0;
                    $scope.nhap_tien();
                }
            });
        }
        $scope.them_thu = function(){
            $scope.dongtien.thuchitiet.push({'noidung':'','sotien':0});
        }
        $scope.them_chi = function(){
            $scope.dongtien.chichitiet.push({'noidung':'','sotien':0});
        }
        $scope.nhap_tien = function(){
            var dunodau = $scope.dongtien.dunodau ? $scope.dongtien.dunodau : 0;
            $scope.dongtien.tongthu = 0;
            $scope.dongtien.tongchi = 0;
            $scope.dongtien.thuchitiet.forEach(function(value, index, arr){
                $scope.dongtien.tongthu += value.sotien;
            });
            $scope.dongtien.chichitiet.forEach(function(value, index, arr){
                $scope.dongtien.tongchi += value.sotien;
            });
            $scope.dongtien.dunocuoi = dunodau + $scope.dongtien.tongthu - $scope.dongtien.tongchi;
        }
        $scope.taiDongDien = function () {
            $http.post('/dongtien').then(function (msg) {
                $scope.dsDongTien = msg.data;
            });
        }
        $scope.luuDongTien = function () {
            if ($scope.dongtien._id == null) {
                $http.post('/dongtien/new', $scope.dongtien).then(function (msg) {
                    $scope.dsDongTien = msg.data.data;
                });
            }
            else {
                var data = $.extend({}, $scope.dongtien);
                delete data['selected'];
                $http.post('/dongtien/update', data).then(function (msg) {
                    $scope.dsDongTien = msg.data.data;
                });
            }
        }
        $scope.chonDongTien = function (tv) {
            $scope.dongtien = $.extend({}, tv);
            for (var i = 0; i < $scope.dsDongTien.length; i++) {
                $scope.dsDongTien[i].selected = '';
            }
            tv.selected = 'active';
        }
        $scope.xoaDongTien = function () {
            var data = $.extend({}, $scope.dongtien);
            $http.post('/dongtien/delete', data).then(function (msg) {
                $scope.dsDongTien = msg.data.data;
            });
        }
    }]);
});