requirejs.config({
    baseUrl: 'javascripts',
    paths: {
        "angular": "../angular/angular.min",
        "angular-route": "../angular-route/angular-route.min",
        "angularAMD": "angularAMD.min",
        "app-config": "app-config",
        "jquery": "jquery-1.11.3.min",
        "ui-bootstrap": "../angular-ui-bootstrap/ui-bootstrap-tpls.min",
        "ng-file-upload": "../ng-file-upload/dist/ng-file-upload.min",
        "ng-file-upload-shim": "../ng-file-upload/dist/ng-file-upload-shim.min",
        "angular-cookie": "angular-cookies.min",
        "jqFloat" : "directives/jqFloat"
    },
    shim: {
        "jquery": {exports: "$"},
        "angular": {exports: "angular"},
        "angular-route": {deps: ["angular"]},
        "angularAMD": {deps: ["angular"]},
        "ui-bootstrap": {deps: ["angular"]},
        "ng-file-upload":{deps:["angular"]},
        "ng-file-upload-shim":{deps:["angular"]},
        "angular-cookie":{deps:["angular"]},
        "jqFloat": {deps:["angular"]}
    },
    deps:["app-config"]
});
