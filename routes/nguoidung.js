var router = require('express').Router();
var NguoiDung = require('../controllers/nguoidung').NguoiDung;

var nguoidung = new NguoiDung();
router.post('/nguoidung', function(req, res, next){    
    nguoidung.findAll(function(error, data){
       res.json(data); 
    });
});
router.post('/nguoidung/new', function(req, res, next){
    nguoidung.addNew(req.body, function(error, data){
        if (error){
            res.json({success: false, data:[], error: error})
        } else{
            res.json({success: true, data: data, error: null});
        }
    });
});
router.post('/nguoidung/update', function(req, res, next){
    nguoidung.update(req.body, function(error, data){
        if (error){
            res.json({success: false, data:[], error: error})
        } else{
            res.json({success: true, data: data, error: null});
        }
    });
});
router.post('/nguoidung/delete', function(req, res, next){
    nguoidung.delete(req.body, function(error, data){
        if (error){
            res.json({success: false, data:[], error: error})
        } else{
            res.json({success: true, data: data, error: null});
        }
    });
});
module.exports = router;