define(["app-config"], function(app){
   app.register.controller("hangmaybayController", ["$scope", "$rootScope", "$routeParams", "$http", function($scope, $rootScope, $routeParams, $http){
       $scope.initController = function(){
           $rootScope.title = 'DANH MỤC HÃNG MÁY BAY';
           $http.post('/hangmaybay').then(function(msg){
               $scope.dsHangMayBay = msg.data;
               $scope.reset();
           });
       }
       $scope.dsHangMayBay = [];
       $scope.reset = function(){
           $scope.hangmaybay = {_id: null, ten: ''};
       }
       $scope.luuHangMayBay = function(){
           if ($scope.hangmaybay._id == null){
               $http.post('/hangmaybay/new', $scope.hangmaybay).then(function(msg){
                  $scope.dsHangMayBay = msg.data.data; 
               });
           }
           else {
               var data = $.extend({}, $scope.hangmaybay);
               delete data['selected'];
               $http.post('/hangmaybay/update', data).then(function(msg){
                  $scope.dsHangMayBay = msg.data.data; 
               });
           }
       }
       $scope.chonHangMayBay = function(tv){
           $scope.hangmaybay = $.extend({}, tv);
           for (var i=0; i < $scope.dsHangMayBay.length; i++){
               $scope.dsHangMayBay[i].selected = '';
           }
           tv.selected = 'active';
       }
       $scope.xoaHangMayBay = function(){
            var data = $.extend({}, $scope.hangmaybay);
            $http.post('/hangmaybay/delete', data).then(function(msg){
                $scope.dsHangMayBay = msg.data.data; 
            });           
       }
   }]); 
});