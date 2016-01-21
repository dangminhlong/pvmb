"use strict";
define(["app-config"], function(app){
   app.register.controller("loginController", ["$scope", "$rootScope", "$routeParams", "$http", "$location", function($scope, $rootScope, $routeParams, $http, $location){
       $scope.initController = function(){
           $rootScope.title = 'ĐĂNG NHẬP HỆ THỐNG';
       }
       $scope.baseSiteUrlPath = $("base").first().attr("href");
       
       $scope.dangnhap=function(){
           $http.post('/login', {username:$scope.tennguoidung, password:$scope.matkhau}).then(function(response){
               localStorage.setItem('user', response.data);
               $location.url('/index.html');  
           });
       }
   }]); 
});