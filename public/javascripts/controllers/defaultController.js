"use strict";
define(["app-config"], function (app) {
    app.register.controller("defaultController", ["$scope", "$rootScope", "$timeout", "$http", function ($scope, $rootScope, $timeout, $http) {
        $scope.initController = function () {
            $rootScope.title = 'PHÒNG VÉ MÁY BAY ÉN VÀNG';
            $scope.note = { noidung: '' };
            $scope.focus = false;
            $scope.getNote();
            /*
            $("#taTodo").jqFloat();
            $('.cloud').each(function () {
                $(this).jqFloat({
                    width: Math.floor(Math.random() * 10) * 10,
                    height: 10,
                    speed: Math.floor(Math.random() * 10) * 100 + 500
                });
            });
            $('#sun').jqFloat({
                width: 10,
                height: 50,
                speed: 1800
            });
           */
        }

        $scope.getNote = function () {
            $http.post('/note/get').then(function (response) {
                if (response.data) {
                    $scope.note = response.data;
                }
            });
        }
        $scope.saveNote = function () {
            $timeout(function () {
                var data = $.extend({}, $scope.note);
                $http.post('/note/save', data).then(function (response) {
                    
                });
            }, 2000);
        }
        $scope.baseSiteUrlPath = $("base").first().attr("href");
    }]);
});