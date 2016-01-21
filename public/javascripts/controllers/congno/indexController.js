define(["app-config"], function (app) {
    app.register.controller("congnoController", ["$scope", "$rootScope", "$routeParams", "$http", "$uibModal", function ($scope, $rootScope, $routeParams, $http, $uibModal) {
        $scope.initController = function () {
            $rootScope.title = 'QUẢN LÝ CÔNG NỢ';
            $scope.dsCongNo = [];
            $scope.dsCTV = [];
            $scope.tong = {};
            $scope.tinhtrangve = "";
            $scope.timtheo = "1";
            $scope.tungay = new Date();
            $scope.denngay = new Date();
            $scope.popup_tungay = { opened: false };
            $scope.popup_denngay = { opened: false };
            $scope.layDsThanhVien();
            $scope.xemCongNo();
            $scope.layDsHangMayBay();
        }
        $scope.chon_tungay = function () {
            $scope.popup_tungay.opened = true;
        }

        $scope.chon_denngay = function () {
            $scope.popup_denngay.opened = true;
        }

        $scope.layDsThanhVien = function () {
            $http.post('/thanhvien').then(function (resp) {
                $scope.dsCTV = resp.data;
            });
        };

        $scope.layDsHangMayBay = function () {
            $http.post('/hangmaybay').then(function (resp) {
                $scope.dsHangMayBay = resp.data;
            });
        };
        
        $scope.huyCongNo = function(){
            var data = $.extend({}, $scope.congno);
            $http.post('/congno/huy', data).then(function (resp) {
                $scope.xemCongNo();  
            });
        }

        $scope.xemCongNo = function () {
            var id_ctv = null;
            if ($scope.ctv)
                id_ctv = $scope.ctv._id;
            var data = {
                timtheo: parseInt($scope.timtheo),
                tu: $scope.tungay,
                den: $scope.denngay,
                tinhtrangve: $scope.tinhtrangve,
                mave: $scope.mave,
                khachhang: $scope.khachhang,
                tinhtrangno: $scope.tinhtrangno,
                ghichu: $scope.ghichu,
                id_ctv: id_ctv,
                hoanve: $scope.hoanve
            }
            $http.post('/congno', data).then(function (msg) {
                var gioHT = new Date();
                msg.data.dscongno.forEach(function(value, index, dsCongNo){
                    var soGio = Math.floor((new Date(value.ngaybay) - gioHT)/(1000*60*60));
                    var soGioDatVe = Math.floor((gioHT - new Date(value.ngaydatve))/(1000*60*60));
                    if (value.tinhtrangve == 'ĐẶT CHỖ' || value.tinhtrangve == 'ĐẶT LẠI'){
                        if (soGio <= 24 || soGioDatVe >= 24){
                            msg.data.dscongno[index].canhbao = 'death';
                        }
                        else {
                            if (soGio <= 48)
                                msg.data.dscongno[index].canhbao = 'yellow';
                            if (soGioDatVe >= 23)
                                msg.data.dscongno[index].canhbao = 'red';
                        }
                        var ngaydatve_dc = new Date(value.ngaydatve);
                        ngaydatve_dc.setHours(ngaydatve_dc.getHours() - 1);
                        msg.data.dscongno[index].ngaydatve_dc = ngaydatve_dc;
                    }                    
                    else if (value.tinhtrangve == 'ĐÃ XUẤT') {
                        msg.data.dscongno[index].canhbao = 'cn_row';
                        if (value.tinhtrangno == 'NỢ')
                            msg.data.dscongno[index].canhbao = 'cn_green';
                        msg.data.dscongno[index].ngaydatve_dc = value.ngaydatve;
                    } 
                    else {
                        msg.data.dscongno[index].ngaydatve_dc = value.ngaydatve;
                    }
                });
                var s = firstBy(function(a, b){
                        var v1 = 5, v2 = 5;
                        if (a.tinhtrangve == 'ĐÃ XUẤT') v1 = 1;
                        if (a.tinhtrangve == 'ĐẶT CHỖ') v1 = 2;
                        if (a.tinhtrangve == 'ĐẶT LẠI') v1 = 3;
                        if (a.tinhtrangve == 'HỦY') v1 = 4;
                        if (b.tinhtrangve == 'ĐÃ XUẤT') v2 = 1;
                        if (b.tinhtrangve == 'ĐẶT CHỖ') v2 = 2;
                        if (b.tinhtrangve == 'ĐẶT LẠI') v2 = 3;
                        if (b.tinhtrangve == 'HỦY') v2 = 4;   
                        if (v1 == v2) return 0;                     
                        return v1 < v2 ? -1 : 1; 
                    })
                    .thenBy(function(v1, v2){
                        var u1 = new Date(v1.ngaydatve);
                        var u2 = new Date(v2.ngaydatve);
                        if (v1.tinhtrangve =='ĐÃ XUẤT' && v2.tinhtrangve == 'ĐÃ XUẤT'){
                            u1.setHours(0,0,0,0);
                            u2.setHours(0,0,0,0);
                        }
                        var t1 = u1.getTime();
                        var t2 = u2.getTime();
                        if (t1 == t2) return 0;
                        return t1 < t2 ? -1 : 1;                        
                    })
                    .thenBy(function(v1,v2){                           
                        var w1 = v1.ctv ? v1.ctv.ten : '';
                        var w2 = v2.ctv ? v2.ctv.ten : '';
                        return w1.localeCompare(w2);                        
                    });
                msg.data.dscongno.sort(s);
                $scope.dsCongNo = msg.data.dscongno;
                $scope.tong = msg.data.tong[0];
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

            $http.post('/congno/excel', data, { responseType: 'arraybuffer' }).then(function (response, status, headers) {
                var blob = new Blob([response.data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                });
                saveAs(blob, "congno.xlsx");
            });
        }

        $scope.chonCongNo = function (cn) {
            $scope.congno = $.extend({}, cn);
            for (var i = 0; i < $scope.dsCongNo.length; i++) {
                $scope.dsCongNo[i].selected = '';
            }
            cn.selected = 'cn_active';
        }

        $scope.suaCongNo = function () {
            if ($scope.congno) {
                $rootScope.updateCongNoStatus = 1;
                $rootScope.congno = $scope.congno;
                var modalInstance = $uibModal.open({
                    templateUrl: 'capnhatCongNoTemplate.html',
                    controller: 'congnoUpdateController',
                    size: 'lg',
                    backdrop: 'static'
                });

                modalInstance.result.then(function (data) {
                    $scope.xemCongNo();
                }, function () { $scope.xemCongNo(); });
            }
        }

        $scope.importExcel = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'uploadExcelTemplate.html',
                controller: 'uploadExcelController',
                size: 'lg'
            });

            modalInstance.result.then(function (data) {

            }, function () {
                $scope.xemCongNo();
            });
        }

        $scope.themMoi = function () {
            $rootScope.updateCongNoStatus = 0;
            var modalInstance = $uibModal.open({
                templateUrl: 'capnhatCongNoTemplate.html',
                controller: 'congnoUpdateController',
                size: 'lg',
                backdrop: 'static'
            });

            modalInstance.result.then(function (data) {
                $scope.xemCongNo();
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }
    }]);

    app.register.controller("uploadExcelController", ["$scope", "$rootScope", "$routeParams", "$http", "Upload", "$uibModalInstance", "$timeout", function ($scope, $rootScope, $routeParams, $http, Upload, $uibModalInstance, $timeout) {
        $scope.uploadFiles = function (files) {
            $scope.files = files;
            if (files && files.length) {
                Upload.upload({
                    url: '/congno/upload',
                    data: {
                        files: files
                    }
                }).then(function (response) {
                    $timeout(function () {
                        $scope.result = response.data;
                    });
                }, function (response) {
                    if (response.status > 0) {
                        $scope.errorMsg = response.status + ': ' + response.data;
                    }
                }, function (evt) {
                    $scope.progress =
                    Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }]);

    app.register.controller("congnoUpdateController", ["$scope", "$rootScope", "$routeParams", "$http", "$uibModalInstance", "$timeout", function ($scope, $rootScope, $routeParams, $http, $uibModalInstance, $timeout) {
        $scope.modelOptions = {
            debounce: {
                default: 500,
                blur: 250
            },
            getterSetter: true
        };
        $scope.popup_ngaydatve = { opened: false };
        $scope.popup_ngayxuatve = { opened: false };
        $scope.popup_ngaybay = { opened: false };
        $scope.popup_ngaybayve = { opened: false };
        $scope.popup_ngaythanhtoan = {opened: false};
        $scope.dsCTV = [];
        $scope.dsHanhTrinh = [];
        $scope.congno = {};
        $scope.initController = function () {
            $scope.layDsHanhTrinh();
            $scope.layDsThanhVien();
            $scope.layDsHangMayBay();
            $scope.title = $rootScope.updateCongNoStatus == 0 ? 'Thêm mới công nợ' : 'Cập nhật công nợ';
            if ($scope.updateCongNoStatus == 0) {
                $scope.congno.ngaybay = new Date();
                $scope.congno.giobay = new Date();
                $scope.congno.ngaydatve = new Date();
                $scope.congno.giodatve = new Date();
                $scope.congno.ckdl = 5000;
                $scope.congno.tinhtrangve = 'ĐẶT CHỖ';
            }
            else {
                $scope.congno = $.extend({}, $rootScope.congno);
                $scope.congno.giobay = $scope.congno.ngaybay;
                $scope.congno.giobayve = $scope.congno.ngaybayve;
                $scope.congno.giodatve = $scope.congno.ngaydatve;
            }
        }

        $scope.layDsHangMayBay = function () {
            $http.post('/hangmaybay').then(function (resp) {
                $scope.dsHangMayBay = resp.data;
            });
        };

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

        $scope.chon_ngaybay = function () {
            $scope.popup_ngaybay.opened = true;
        }
        $scope.chon_ngaybayve = function () {
            $scope.popup_ngaybayve.opened = true;
        }
        $scope.chon_ngaydatve = function () {
            $scope.popup_ngaydatve.opened = true;
        }
        $scope.chon_ngayxuatve = function () {
            $scope.popup_ngayxuatve.opened = true;
        }
        $scope.chon_ngaythanhtoan = function () {
            $scope.popup_ngaythanhtoan.opened = true;
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.xuatve = function () {
            $scope.congno.tinhtrangve = 'ĐÃ XUẤT';
            $scope.congno.phaithu = $scope.congno.giaban - (!$scope.congno.ckctv ? 0 : $scope.congno.ckctv);
            $scope.congno.loinhuan = $scope.congno.phaithu - $scope.congno.giave - $scope.congno.ckdl;
            $scope.congno.tinhtrangno = 'NỢ';
        }

        $scope.thayDoiGia = function () {
            if ($scope.congno.tinhtrangve == 'ĐÃ XUẤT') {
                $scope.congno.phaithu = $scope.congno.giaban - (!$scope.congno.ckctv ? 0 : $scope.congno.ckctv);
                $scope.congno.loinhuan = $scope.congno.phaithu - $scope.congno.giave - $scope.congno.ckdl;                
            }
        }
        
        $scope.chonHanhTrinh = function(){
            $scope.congno.ckctv = !$scope.congno.ctv ? 0 : $scope.congno.hanhtrinh.heso*$scope.congno.ctv.chietkhau;
            $scope.congno.ckdl = $scope.congno.hanhtrinh.heso*5000;
            if ($scope.congno.tinhtrangve == 'ĐÃ XUẤT'){
                $scope.congno.phaithu = $scope.congno.giaban - $scope.congno.ckctv;
                $scope.congno.loinhuan = $scope.congno.phaithu - $scope.congno.giave - $scope.congno.ckdl;
            }
        }

        $scope.chonCTV = function () {
            if ($rootScope.updateCongNoStatus == 0 && $scope.congno.ctv.chietkhau) {
                $scope.congno.ckctv = $scope.congno.ctv.chietkhau;
            }
        }
        
        $scope.chontinhtrang = function(){
            if ($scope.congno.tinhtrangve == 'ĐÃ XUẤT') {
                $scope.congno.phaithu = $scope.congno.giaban - (!$scope.congno.ckctv ? 0 : $scope.congno.ckctv);
                $scope.congno.loinhuan = $scope.congno.phaithu - $scope.congno.giave - $scope.congno.ckdl;
                $scope.congno.tinhtrangno = 'NỢ';
            } else if ($scope.congno.tinhtrangve == 'HOÀN VÉ') {
                $scope.congno.phaithu = $scope.congno.giave;
                $scope.congno.loinhuan = - $scope.congno.ckdl;
                $scope.congno.hoanve = 'CHƯA';
                $scope.congno.tinhtrangno = 'NỢ';
                delete $scope.congno["ngaythanhtoan"];
            }
            
        }

        $scope.chonthanhtoan = function(){
            $scope.congno.tinhtrangno = 'ĐÃ THANH TOÁN';
        }
        
         $scope.thanhtoan = function(){
            if (!$scope.congno.ngaythanhtoan && $scope.congno.tinhtrangve == 'ĐÃ XUẤT' && $scope.congno.tinhtrangno == 'ĐÃ THANH TOÁN'){
                $scope.congno.ngaythanhtoan = new Date();
            }
        }

        $scope.hoanve = function(){
            if ($scope.congno.tinhtrangve == 'HOÀN VÉ' && $scope.congno.hoanve == 'RỒI' ){
                $scope.congno.ngayhoanve = new Date();
                $scope.congno.tinhtrangno = 'ĐÃ THANH TOÁN';
                $scope.congno.ngaythanhtoan = new Date();
            }
        }

        $scope.luuCongNo = function () {
            var data = $.extend({}, $scope.congno);
            var nam = new Date(data.ngaybay).getFullYear();
            var thang = new Date(data.ngaybay).getMonth();
            var ngay = new Date(data.ngaybay).getDate();
            var gio = new Date(data.giobay).getHours();
            var phut = new Date(data.giobay).getMinutes();
            
            var namdv = new Date(data.ngaydatve).getFullYear();
            var thangdv = new Date(data.ngaydatve).getMonth();
            var ngaydv = new Date(data.ngaydatve).getDate();
            var giodv = new Date(data.giodatve).getHours();
            var phutdv = new Date(data.giodatve).getMinutes();
            delete data["giodatve"];
            data.ngaydatve = new Date(namdv, thangdv, ngaydv, giodv, phutdv, 0);
            
            if (data.ngaybayve && data.giobayve) {
                var namve = new Date(data.ngaybayve).getFullYear();
                var thangve = new Date(data.ngaybayve).getMonth();
                var ngayve = new Date(data.ngaybayve).getDate();
                var giove = new Date(data.giobayve).getHours();
                var phutve = new Date(data.giobayve).getMinutes();
                delete data['giobayve'];
                data.ngaybayve = new Date(namve, thangve, ngayve, giove, phutve, 0);
            }
            if (data.ctv){
                delete data.ctv["dienthoai"];
                delete data.ctv["diachi"];
                delete data.ctv["matheVIP"];
                delete data.ctv["diemVIP"];
                delete data.ctv["diemthuong"];
                delete data.ctv["loaithanhvien"];
                delete data.ctv["khuvuc"];
            }
            delete data["giobay"];
            delete data["canhbao"];
            delete data["selected"];
            delete data["ngaydatve_dc"];
            data.ngaybay = new Date(nam, thang, ngay, gio, phut, 0);
            if ($rootScope.updateCongNoStatus == 0) {
                $scope.updateStatus = 'Bắt đầu thêm công nợ';
                $http.post('/congno/new', data).then(function (resp) {
                    $scope.updateStatus = 'Thêm công nợ thành công';
                }, function(err){
                    $scope.updateStatus = 'Thêm công nợ thất bại. Xin vui lòng thực hiện lại sau';
                });
            }
            else {
                $scope.updateStatus = 'Bắt đầu sửa công nợ';
                $http.post('/congno/update', data).then(function (resp) {
                    $scope.updateStatus = 'Sửa công nợ thành công';
                }, function(err){
                    $scope.updateStatus = 'Sửa công nợ thất bại. Xin vui lòng thực hiện lại sau';
                });
            }
        }
    }]);
});