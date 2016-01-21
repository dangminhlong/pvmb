define(["app-config"], function(app){
   app.register.controller("khuvucController", ["$scope", "$rootScope", "$routeParams", "$http", function($scope, $rootScope, $routeParams, $http){
       $scope.initController = function(){
           $rootScope.title = 'QUẢN LÝ KHU VỰC';
           $http.post('/khuvuc').then(function(msg){
               $scope.dsKhuVuc = msg.data;
               $scope.reset();
           });
       }
       $scope.dsKhuVuc = [];
       $scope.reset = function(){
           $scope.khuvuc = {_id: null, ten: ''};
       }
       $scope.luuKhuVuc = function(){
           if ($scope.khuvuc._id == null){
               $http.post('/khuvuc/new', $scope.khuvuc).then(function(msg){
                  $scope.dsKhuVuc = msg.data.data; 
               });
           }
           else {
               var data = $.extend({}, $scope.khuvuc);
               delete data['selected'];
               $http.post('/khuvuc/update', data).then(function(msg){
                  $scope.dsKhuVuc = msg.data.data; 
               });
           }
       }
       $scope.chonKhuVuc = function(tv){
           $scope.khuvuc = $.extend({}, tv);
           for (var i=0; i < $scope.dsKhuVuc.length; i++){
               $scope.dsKhuVuc[i].selected = '';
           }
           tv.selected = 'active';
       }
       $scope.xoaKhuVuc = function(){
            var data = $.extend({}, $scope.khuvuc);
            $http.post('/khuvuc/delete', data).then(function(msg){
                $scope.dsKhuVuc = msg.data.data; 
            });           
       }
   }]); 
});