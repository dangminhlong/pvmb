define(["app-config"], function (app) {
    app.register.controller("nhantinController", ["$scope", "$rootScope", "$location", "$http", function ($scope, $rootScope, $location, $http) {
        $scope.initController = function () {
            $rootScope.title = 'QUẢN LÝ NHẮN TIN';
            $scope.url = localStorage.getItem('smsURL');
            $scope.layDsSMS();
            $scope.layDsThanhVien();
        }
        $scope.dsSMS = [];
        $scope.dsCTV = [];
        $scope.reset = function () {
            $scope.sms = { _id: null, dienthoai: '', noidung: '' };
        }
        $scope.layDsThanhVien = function () {
            $http.post('/thanhvien').then(function (resp) {
                var dsCTV = resp.data;
                dsCTV.forEach(function(value, idx, _dsCTV){
                    value.sodienthoai = $.type(value)==='string' ? value.dienthoai : value.dienthoai.dienthoai;
                });
                $scope.dsCTV = resp.data;

            });
        };
        $scope.layDsSMS = function(){
            $http.post('/sms').then(function(response){
                $scope.dsSMS = response.data;
            });
        };
        
        $scope.nhantin = function () {
            localStorage.setItem('smsURL', $scope.url);     
            var url = $scope.url + '/services/api/messaging/';
            var dienthoai = $scope.sms.dienthoai.dienthoai ? $scope.sms.dienthoai.dienthoai : $scope.sms.dienthoai;
            var data = new FormData();
            data.append("To", dienthoai);
            data.append("Message", $scope.sms.noidung);
            var x_requested_with = $http.defaults.headers.common['X-Requested-With'];
            delete $http.defaults.headers.common['X-Requested-With'];
            $http.post(url, data, {
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            }).success(function (data, status, headers, config) {
                var ngay = new Date();
                var kh = data.message.to;
                var noidung = $scope.sms.noidung;
                var dienthoai = $scope.sms.dienthoai;
                $http.post("/sms/new", {ngay: ngay, kh: kh, noidung:noidung, dienthoai: dienthoai}).then(function(response){
                    $scope.dsSMS = response.data.data;
                });
            }).error(function (data, status, headers, config) {

            });
            $http.defaults.headers.common['X-Requested-With'] = x_requested_with;
        }
        
        $scope.chonSMS = function (sms) {
            $scope.sms = $.extend({}, sms);
            for (var i = 0; i < $scope.dsSMS.length; i++) {
                $scope.dsSMS[i].selected = '';
            }
            sms.selected = 'active';
        }
        
        $scope.xoasms = function () {
            var data = $.extend({}, $scope.sms);
            $http.post('/sms/delete', data).then(function (msg) {
                $scope.dsSMS = msg.data.data;
            });
        }
        
        $scope.timkiem = function(){
            var data = $.extend({}, $scope.search);
            $http.post('/sms/search', data).then(function (msg) {
                $scope.dsSMS = msg.data;
            });
        }
    }]);
});