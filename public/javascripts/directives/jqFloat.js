"use strict";
angular.module('jqFloat', []).directive('jqfloat', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            $(element).jqFloat();
        }
    };
});