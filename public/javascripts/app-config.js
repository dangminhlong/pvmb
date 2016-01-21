define(["angularAMD", "angular-route", "ui-bootstrap", "ng-file-upload-shim", "ng-file-upload", "angular-cookie", "jqFloat"], function(angularAMD){
    
    function isLoggedIn($q,$http, $location){
        var deferred = $q.defer();
        $http.post('/isLoggedIn').then(function(response){
            if (response.data.length)
                deferred.resolve();
            else {
                deferred.reject();
                $location.url('/login');
            }
        });
        return deferred.promise;
    }
    
    var app = angular.module("pvmb", ["ngRoute", "ui.bootstrap", "ngFileUpload", "ngCookies", "jqFloat"]);
    app.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {  
        var baseSiteUrlPath = $("base").first().attr("href"); 
        $httpProvider.interceptors.push(function($q, $location) { 
            return { 
                response: function(response) { // do something on success 
                    return response; 
                }, 
                responseError: function(response) { 
                    if (response.status === 401) 
                        $location.url('/login'); 
                    return $q.reject(response);
                } 
            }; 
        }); 
        
        $routeProvider
            .when("/login", angularAMD.route({
                templateUrl: function (rp) {  return '/templates/login.html';  },               
                resolve: {
                    load: ['$q', '$rootScope', '$location', 
                        function ($q, $rootScope, $location) {
                            var loadController = "controllers/loginController";
                            var deferred = $q.defer();
                            require([loadController], function () {
                                    $rootScope.$apply(function () {
                                    deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }]
                }
            }))
            .when("/", angularAMD.route({                                
                templateUrl: function (rp) {  return '/templates/default.html';  },               
                controllerUrl: "controllers/defaultController",
                resolve: {
                    isLoggedIn: ['$q','$http','$location',isLoggedIn] 
                }          
            }))

            .when("/:section/:tree", angularAMD.route({
                templateUrl: function (rp) { 
                            return '/templates/' + rp.section + '/' + rp.tree + '.html'; },
                resolve: {
                    load: ['$q', '$rootScope', '$location', 
                        function ($q, $rootScope, $location) {
                            
                            var path = $location.path();
                            var parsePath = path.split("/");
                            var parentPath = parsePath[1];
                            var controllerName = parsePath[2];
                            var loadController = "controllers/" + parentPath + "/" + 
                                                controllerName + "Controller";

                            var deferred = $q.defer();
                            require([loadController], function () {
                                    $rootScope.$apply(function () {
                                    deferred.resolve();
                            });
                        });
                        return deferred.promise;
                        }]
                }
            }))
            
            .when("/:section/:tree/:id", angularAMD.route({
                templateUrl: function (rp) { 
                            return '/templates/' + rp.section + '/' + rp.tree + '.html'; },

                resolve: {
                load: ['$q', '$rootScope', '$location', 
                    function ($q, $rootScope, $location) {
                        var path = $location.path();
                        var parsePath = path.split("/");
                        var parentPath = parsePath[1];
                        var controllerName = parsePath[2];
                        var loadController = "controllers/" + parentPath + "/" + 
                                            controllerName + "Controller";
                                                    
                        var deferred = $q.defer();
                        require([loadController], function () {
                            $rootScope.$apply(function () {
                                deferred.resolve();
                                });
                    });
                    return deferred.promise;
                    }]
                    }
                }))
                .otherwise({ redirectTo: '/' }) ;
                
           
        }])
        .run( function($rootScope, $http, $location) {
            $rootScope.logout = function(){
                $http.post('/logout').then(function(result){
                    $location.url('/login');
                });
            }
            $rootScope.user = localStorage.getItem('user');
        });;     
    angularAMD.bootstrap(app);  
    return app;
});