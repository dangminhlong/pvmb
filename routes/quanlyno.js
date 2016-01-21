var router = require('express').Router();
var QuanLyNo = require('../controllers/quanlyno').QuanLyNo;
var date = require('../date');
var json2xls = require('json2xls');

var quanlyno = new QuanLyNo();
router.post('/quanlyno', function (req, res, next) {
    quanlyno.findAll(function (error, data) {
        res.json(data);
    });
});

router.post('/quanlyno/chitiet', function (req, res, next) {
    quanlyno.findChiTiet(req.body.ctv_id, function (error, data) {
        res.json(data);
    });
});

router.post('/quanlyno/excelchitiet', function (req, res, next) {
    quanlyno.findChiTiet(req.body.ctv_id, function (error, data) {
        var jsonArray = [];
        for (var i = 0; i < data.length; i++) {
            var record = data[i];
            var tempArry = {
                'ngay': date.formatDate(record.ngay_ct, 'dd/MM/yyyy HH:mm'),
                'sotien': record.sotien,
                'ghichu': record.ghichu,
                'hinhthuc': record.loai == 1 ? 'Thêm nợ' : 'Giảm nợ',
                'user': record.user
            }
            jsonArray.push(tempArry);
        };

        var xls = json2xls(jsonArray);
        res.type('xlsx');
        res.end(new Buffer(xls, 'binary'));
    });
});

router.post('/quanlyno/themno', function (req, res, next) {
    quanlyno.themno(req.body, req.user, function (error, data) {
        if (error) {
            res.json({ success: false, data: [], error: error })
        } else {
            res.json({ success: true, data: data, error: null });
        }
    });
});
router.post('/quanlyno/giamno', function (req, res, next) {
    quanlyno.giamno(req.body, req.user, function (error, data) {
        if (error) {
            res.json({ success: false, data: [], error: error })
        } else {
            res.json({ success: true, data: data, error: null });
        }
    });
});
module.exports = router;