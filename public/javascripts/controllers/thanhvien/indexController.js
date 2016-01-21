define(["app-config"], function(app){
   app.register.controller("thanhvienController", ["$scope", "$rootScope", "$routeParams", "$http", function($scope, $rootScope, $routeParams, $http){
       $scope.dsThanhVien = [];
       $scope.initController = function(){
           $rootScope.title = 'QUẢN LÝ THÀNH VIÊN';
           $scope.search_crit = firstBy(function(v1,v2){return (v1.khuvuc?v1.khuvuc:'').localeCompare(v2.khuvuc?v2.khuvuc:'')}).thenBy(function(v1,v2){
              var w1 = v1.diachi.split(" ").pop();
              var w2 = v2.diachi.split(" ").pop();
              return (w1?w1:'').localeCompare((w2?w2:''));
           });
           $http.post('/loaithanhvien').then(function(msg){
               $scope.dsLoaiThanhVien = msg.data.map(function(item){
                   return item.ten;
               });
           });
           $http.post('/khuvuc').then(function(msg){
               $scope.dsKhuVuc = msg.data.map(function(item){
                   return item.ten;
               });
           });
           $http.post('/thanhvien').then(function(msg){
               $scope.dsThanhVien = msg.data.sort($scope.search_crit);               
           });
           
           $scope.reset();
       }
       $scope.reset = function(){
           $scope.thanhvien = {_id: null, ten: '', dienthoai: '', diachi: '', matheVIP: '',  diemVIP: 0, chietkhau: 0};
       }
       $scope.luuThanhVien = function(){
           if ($scope.thanhvien._id == null){
               $http.post('/thanhvien/new', $scope.thanhvien).then(function(msg){
                  $scope.dsThanhVien = msg.data.data.sort($scope.search_crit); 
               });
           }
           else {
               var data = $.extend({}, $scope.thanhvien);
               delete data['selected'];
               $http.post('/thanhvien/update', data).then(function(msg){
                  $scope.dsThanhVien = msg.data.data.sort($scope.search_crit); 
               });
           }
       }
       $scope.chonThanhVien = function(tv){
           $scope.thanhvien = $.extend({}, tv);
           for (var i=0; i < $scope.dsThanhVien.length; i++){
               $scope.dsThanhVien[i].selected = '';
           }
           tv.selected = 'active';
       }
       $scope.xoaThanhVien = function(){
            var data = $.extend({}, $scope.thanhvien);
            $http.post('/thanhvien/delete', data).then(function(msg){
                $scope.dsThanhVien = msg.data.data.sort($scope.search_crit); 
            });           
       }
       $scope.xuatExcel = function () {
            var id_ctv = null;
            if ($scope.ctv)
                id_ctv = $scope.ctv._id;
            var data = {
                tu: $scope.tungay,
                den: $scope.denngay,
                tinhtrangve: $scope.tinhtrangve,
                mave: $scope.mave,
                khachhang: $scope.khachhang,
                tinhtrangno: $scope.tinhtrangno,
                ghichu: $scope.ghichu,
                id_ctv: id_ctv
            }
            
            $http.post('/thanhvien/excel', data, { responseType: 'arraybuffer' }).then(function (response, status, headers) {
                var blob = new Blob([response.data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                });
                saveAs(blob, "thanhvien.xlsx");
            });            
        }
        $scope.timkiem = function(){
            var data = $.extend({}, $scope.search);
            $http.post('/thanhvien/search', data).then(function(response){
               $scope.dsThanhVien = response.data.sort($scope.search_crit); 
            });
        }
   }]); 
});