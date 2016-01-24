define(["app-config"], function(app){
   app.register.controller("cangiareController", ["$scope", "$rootScope", "$routeParams", "$http", function($scope, $rootScope, $routeParams, $http){
       $scope.initController = function(){
           $rootScope.title = 'CĂN GIÁ VÉ RẺ';
           $http.post('/cangiare').then(function(msg){
               $scope.dsCanGiaRe = msg.data;
               $scope.reset();
           });
           $scope.layDsThanhVien();
           $scope.layDsHanhTrinh();
       }
       $scope.layDsThanhVien = function () {
           $http.post('/thanhvien').then(function (resp) {
               $scope.dsCTV = resp.data;
           });
       };
       $scope.layDsHanhTrinh = function () {
           $http.post('/hanhtrinh').then(function (resp) {
               $scope.dsHanhTrinh = resp.data.map(function (item) {
                   return {ten:item.ten, heso:item.heso};
               });
           });
       };
       $scope.dsCanGiaRe = [];
       $scope.pop_tungay = {opened: false};
       $scope.pop_denngay = {opened: false};
       $scope.chon_tungay = function(){
           $scope.pop_tungay.opened = true;
       }
       $scope.chon_denngay=function(){
           $scope.pop_denngay.opened = true;
       }
       $scope.reset = function(){
           $scope.cangiare = {_id: null, ten: ''};
       }
       $scope.luuCanGiaRe = function(){
           if ($scope.cangiare._id == null){
               $http.post('/cangiare/new', $scope.cangiare).then(function(msg){
                  $scope.dsCanGiaRe = msg.data.data; 
               });
           }
           else {
               var data = $.extend({}, $scope.cangiare);
               delete data['selected'];
               $http.post('/cangiare/update', data).then(function(msg){
                  $scope.dsCanGiaRe = msg.data.data; 
               });
           }
       }
       $scope.chonCanGiaRe = function(tv){
           $scope.cangiare = $.extend({}, tv);
           for (var i=0; i < $scope.dsCanGiaRe.length; i++){
               $scope.dsCanGiaRe[i].selected = '';
           }
           tv.selected = 'active';
       }
       $scope.xoaCanGiaRe = function(){
            var data = $.extend({}, $scope.cangiare);
            $http.post('/cangiare/delete', data).then(function(msg){
                $scope.dsCanGiaRe = msg.data.data; 
            });           
       }
   }]); 
});