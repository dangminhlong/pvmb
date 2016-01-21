var router = require('express').Router();
var LoaiThanhVien = require('../controllers/loaithanhvien').LoaiThanhVien;

var loaithanhvien = new LoaiThanhVien();
router.post('/loaithanhvien', function(req, res, next){    
    loaithanhvien.findAll(function(error, data){
       res.json(data); 
    });
});
router.post('/loaithanhvien/new', function(req, res, next){
    loaithanhvien.addNew(req.body, function(error, data){
        if (error){
            res.json({success: false, data:[], error: error})
        } else{
            res.json({success: true, data: data, error: null});
        }
    });
});
router.post('/loaithanhvien/update', function(req, res, next){
    loaithanhvien.update(req.body, function(error, data){
        if (error){
            res.json({success: false, data:[], error: error})
        } else{
            res.json({success: true, data: data, error: null});
        }
    });
});
router.post('/loaithanhvien/delete', function(req, res, next){
    loaithanhvien.delete(req.body, function(error, data){
        if (error){
            res.json({success: false, data:[], error: error})
        } else{
            res.json({success: true, data: data, error: null});
        }
    });
});
module.exports = router;