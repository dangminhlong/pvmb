var fs = require('fs');
var xlsx = require('xlsx');
var json2xls = require('json2xls');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var router = require('express').Router();
var CongNo = require('../controllers/congno').CongNo;
var date = require('../date');

var congno = new CongNo();
router.post('/congno', function (req, res, next) {
    congno.findAll(req.body.timtheo,req.body.tu, req.body.den, req.body.tinhtrangve, req.body.tinhtrangno, req.body.hoanve, req.body.mave, req.body.id_ctv, req.body.khachhang, req.body.ghichu, function (error, dscongno, tong) {
        res.json({ dscongno: dscongno, tong: tong });
    });
});
router.post('/congno/new', function (req, res, next) {
    req.body.user_tao = req.user;
    congno.addNew(req.body, function (error, data) {
        if (error) {
            res.json({ success: false, data: [], error: error });
        } else {
            res.json({ success: true, data: data, error: null });
        }
    });
});
router.post('/congno/update', function (req, res, next) {
    req.body.user_sua = req.user;
    congno.update(req.body, function (error, data) {
        if (error) {
            res.json({ success: false, data: [], error: error });
        } else {
            res.json({ success: true, data: data, error: null });
        }
    });
});
router.post('/congno/delete', function (req, res, next) {
    req.body.user_sua = req.user;
    congno.delete(req.body, function (error, data) {
        if (error) {
            res.json({ success: false, data: [], error: error });
        } else {
            res.json({ success: true, data: data, error: null });
        }
    });
});
router.post('/congno/huy', function (req, res, next) {
    req.body.user_sua = req.user;
    congno.huy(req.body, function (error, data) {
        if (error) {
            res.json({ success: false, data: null, error: error });
        } else {
            res.json({ success: true, data: data, error: null });
        }
    });
});
router.post('/congno/thu', function (req, res, next) {
    congno.thu(req.body.ngay, function (error, data) {
        if (error) {
            res.json({ success: false, data: [], error: error });
        } else {
            res.json({ success: true, data: data, error: null });
        }
    });
});
router.post('/congno/upload', multipartMiddleware, function (req, res, next) {
    var has_error = false;
    for (var i = 0; i < req.files.files.length; i++) {
        var file = req.files.files[i];
        var workbook = xlsx.readFile(file.path);
        var data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        var jsonArray = [];
        data.forEach(function(instance, index, record){
            var item = {
                ngaydatve: new Date(date.getDateFromFormat(record[index].ngaydatve, 'dd/MM/yyyy HH:mm')),
                ctv  : {_id: record[index].id_ctv, ten: record[index].ctv},
                khachhang: record[index].khachhang,
                hanhtrinh: record[index].hanhtrinh,
                mave: record[index].mave,
                ngaybay: new Date(date.getDateFromFormat(record[index].giobay, 'dd/MM/yyyy HH:mm')),
                giave: Number(record[index].giave),
                giaban: Number(record[index].giaban),
                ckdl: Number(record[index].ckdl),
                ckctv: Number(record[index].ckctv),
                phaithu: Number(record[index].phaithu),
                loinhuan: Number(record[index].loinhuan),
                tinhtrangve: record[index].tinhtrangve,
                tinhtrangno: record[index].tinhtrangno,
                ngayxuatve: new Date(date.getDateFromFormat(record[index].ngayxuatve, 'dd/MM/yyyy HH:mm')),
                ghichu: record[index].ghichu,
                user_tao: record[index].user_tao,
                user_sua: record[index].user_sua
            };
            jsonArray.push(item);
        });
        congno.importExcel(jsonArray, function (err, result) {
            if (err)
                has_error = true;
        });
        fs.unlinkSync(file.path);
    }
    res.json({ completed: true, success: !has_error });
});
router.post('/congno/excel', function (req, res, next) {
    congno.findAll(req.body.timtheo,req.body.tu, req.body.den, req.body.tinhtrangve, req.body.tinhtrangno, req.body.hoanve, req.body.mave, req.body.id_ctv, req.body.khachhang, req.body.ghichu, function (error, dscongno, tong) {
        var jsonArray = [];
        for (var i = 0; i < dscongno.length; i++){
            var record = dscongno[i];
            var tempArry = {
                'ngaydatve': date.formatDate(record.ngaydatve, 'dd/MM/yyyy HH:mm'),
                'ctv': record.ctv.ten,
                'khachhang': record.khachhang,
                'hanhtrinh': record.hanhtrinh,
                'mave': record.mave,
                'giobay': date.formatDate(record.ngaybay, 'dd/MM/yyyy HH:mm'),
                'giave': record.giave,
                'giaban': record.giaban,
                'ckdl': record.ckdl,
                'ckctv': record.ckctv,
                'phaithu': record.phaithu,
                'loinhuan': record.loinhuan,
                'tinhtrangve': record.tinhtrangve,
                'tinhtrangno': record.tinhtrangno,
                'ghichu': record.ghichu,
                'ngayxuatve': date.formatDate(record.ngayxuatve, 'dd/MM/yyyy HH:mm'),
                'id_ctv': record.ctv._id,
                'user_tao': record.user_tao,
                'user_sua': record.user_sua
            }
            jsonArray.push(tempArry);
        };
        jsonArray.push({
            'ctv': 'Tổng',
            'giave': tong[0].tonggiave,
            'giaban': tong[0].tonggiaban,
            'ckdl': tong[0].tongckdl,
            'ckctv': tong[0].tongckctv,
            'phaithu': tong[0].tongphaithu,
            'loinhuan': tong[0].tongloinhuan
        });
        
        var xls = json2xls(jsonArray);
        res.type('xlsx');
        res.end(new Buffer(xls, 'binary'));
    });

});
module.exports = router;