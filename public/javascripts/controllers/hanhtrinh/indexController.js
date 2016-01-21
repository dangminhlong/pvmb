define(["app-config"], function(app){
   app.register.controller("hanhtrinhController", ["$scope", "$rootScope", "$routeParams", "$http", function($scope, $rootScope, $routeParams, $http){
       $scope.initController = function(){
           $rootScope.title = 'QUẢN LÝ HÀNH TRÌNH';
           $http.post('/hanhtrinh').then(function(msg){
               $scope.dsHanhTrinh = msg.data;
               $scope.reset();
           });
       }
       $scope.dsHanhTrinh = [];
       $scope.reset = function(){
           $scope.hanhtrinh = {_id: null, ten: '', heso: 1};
       }
       $scope.luuHanhTrinh = function(){
           if ($scope.hanhtrinh._id == null){
               $http.post('/hanhtrinh/new', $scope.hanhtrinh).then(function(msg){
                  $scope.dsHanhTrinh = msg.data.data; 
               });
           }
           else {
               var data = $.extend({}, $scope.hanhtrinh);
               delete data['selected'];
               $http.post('/hanhtrinh/update', data).then(function(msg){
                  $scope.dsHanhTrinh = msg.data.data; 
               });
           }
       }
       $scope.chonHanhTrinh = function(tv){
           $scope.hanhtrinh = $.extend({}, tv);
           for (var i=0; i < $scope.dsHanhTrinh.length; i++){
               $scope.dsHanhTrinh[i].selected = '';
           }
           tv.selected = 'active';
       }
       $scope.xoaHanhTrinh = function(){
            var data = $.extend({}, $scope.hanhtrinh);
            $http.post('/hanhtrinh/delete', data).then(function(msg){
                $scope.dsHanhTrinh = msg.data.data; 
            });           
       }
   }]); 
});