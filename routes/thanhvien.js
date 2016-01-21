var router = require('express').Router();
var json2xls = require('json2xls');
var ThanhVien = require('../controllers/thanhvien').ThanhVien;

var thanhvien = new ThanhVien();
router.post('/thanhvien', function(req, res, next){    
    thanhvien.findAll(function(error, data){
       res.json(data); 
    });
});
router.post('/thanhvien/new', function(req, res, next){
    thanhvien.addNew(req.body, function(error, data){
        if (error){
            res.json({success: false, data:[], error: error})
        } else{
            res.json({success: true, data: data, error: null});
        }
    });
});
router.post('/thanhvien/update', function(req, res, next){
    thanhvien.update(req.body, function(error, data){
        if (error){
            res.json({success: false, data:[], error: error})
        } else{
            res.json({success: true, data: data, error: null});
        }
    });
});
router.post('/thanhvien/delete', function(req, res, next){
    thanhvien.delete(req.body, function(error, data){
        if (error){
            res.json({success: false, data:[], error: error})
        } else{
            res.json({success: true, data: data, error: null});
        }
    });
});
router.post('/thanhvien/findByName', function(req, res, next){
   thanhvien.findByName(req.body.name, function(error, data){
       res.json(data);
   } );
});
router.post('/thanhvien/search', function(req, res, next){
   thanhvien.search(req.body.ten, req.body.dienthoai, function(error, data){
       res.json(data);
   } );
});
router.post('/thanhvien/excel', function(req, res, next){    
    thanhvien.findAll(function(error, data){
       var jsonArray = [];
        for (var i = 0; i < data.length; i++){
            var record = data[i];
            var tempArry = {
                id: record._id,
                ten: record.ten,
                dienthoai: record.dienthoai,
                diachi: record.diachi,
                matheVIP: record.matheVIP,
                diemVIP: record.diemVIP,
                chietkhau: record.chietkhau
            }
            jsonArray.push(tempArry);
        };
        var xls = json2xls(jsonArray);
        res.type('xlsx');
        res.end(new Buffer(xls, 'binary'));
    });
});
module.exports = router;