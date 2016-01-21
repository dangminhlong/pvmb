define(["app-config"], function(app){
   app.register.controller("nguoidungController", ["$scope", "$rootScope", "$routeParams", "$http", function($scope, $rootScope, $routeParams, $http){
       $scope.initController = function(){
           $rootScope.title = 'QUẢN LÝ NGƯỜI DÙNG';
           $http.post('/nguoidung').then(function(msg){
               $scope.dsNguoiDung = msg.data;
               $scope.reset();
           });
       }
       $scope.baseSiteUrlPath = $("base").first().attr("href");
       $scope.dsNguoiDung = [];
       $scope.reset = function(){
           $scope.nguoidung = {_id: null, ten: '', tennguoidung: '', matkhau: ''};
       }
       $scope.luuNguoiDung = function(){
           if ($scope.nguoidung._id == null){
               $http.post('/nguoidung/new', $scope.nguoidung).then(function(msg){
                  $scope.dsNguoiDung = msg.data.data; 
               });
           }
           else {
               var data = $.extend({}, $scope.nguoidung);
               delete data['selected'];
               $http.post('/nguoidung/update', data).then(function(msg){
                  $scope.dsNguoiDung = msg.data.data; 
               });
           }
       }
       $scope.chonNguoiDung = function(tv){
           $scope.nguoidung = $.extend({}, tv);
           for (var i=0; i < $scope.dsNguoiDung.length; i++){
               $scope.dsNguoiDung[i].selected = '';
           }
           tv.selected = 'active';
       }
       $scope.xoaNguoiDung = function(){
            var data = $.extend({}, $scope.nguoidung);
            $http.post('/nguoidung/delete', data).then(function(msg){
                $scope.dsNguoiDung = msg.data.data; 
            });           
       }
   }]); 
});