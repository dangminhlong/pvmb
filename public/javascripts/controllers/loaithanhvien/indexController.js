define(["app-config"], function(app){
   app.register.controller("loaithanhvienController", ["$scope", "$rootScope", "$routeParams", "$http", function($scope, $rootScope, $routeParams, $http){
       $scope.initController = function(){
           $rootScope.title = 'QUẢN LÝ LOẠI THÀNH VIÊN';
           $http.post('/loaithanhvien').then(function(msg){
               $scope.dsLoaiThanhVien = msg.data;
               $scope.reset();
           });
       }
       $scope.dsLoaiThanhVien = [];
       $scope.reset = function(){
           $scope.loaithanhvien = {_id: null, ten: ''};
       }
       $scope.luuLoaiThanhVien = function(){
           if ($scope.loaithanhvien._id == null){
               $http.post('/loaithanhvien/new', $scope.loaithanhvien).then(function(msg){
                  $scope.dsLoaiThanhVien = msg.data.data; 
               });
           }
           else {
               var data = $.extend({}, $scope.loaithanhvien);
               delete data['selected'];
               $http.post('/loaithanhvien/update', data).then(function(msg){
                  $scope.dsLoaiThanhVien = msg.data.data; 
               });
           }
       }
       $scope.chonLoaiThanhVien = function(tv){
           $scope.loaithanhvien = $.extend({}, tv);
           for (var i=0; i < $scope.dsLoaiThanhVien.length; i++){
               $scope.dsLoaiThanhVien[i].selected = '';
           }
           tv.selected = 'active';
       }
       $scope.xoaLoaiThanhVien = function(){
            var data = $.extend({}, $scope.loaithanhvien);
            $http.post('/loaithanhvien/delete', data).then(function(msg){
                $scope.dsLoaiThanhVien = msg.data.data; 
            });           
       }
   }]); 
});