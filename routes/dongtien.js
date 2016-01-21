var router = require('express').Router();
var DongTien = require('../controllers/dongtien').DongTien;

var dongtien = new DongTien();
router.post('/dongtien', function(req, res, next){    
    dongtien.findAll(function(error, data){
       res.json(data); 
    });
});
router.post('/dongtien/dunodau', function(req, res, next){    
    dongtien.dunodau(req.body.ngay, function(error, data){
       res.json(data); 
    });
});
router.post('/dongtien/new', function(req, res, next){
    req.body.user = req.user;
    dongtien.addNew(req.body, function(error, data){
        if (error){
            res.json({success: false, data:[], error: error})
        } else{
            res.json({success: true, data: data, error: null});
        }
    });
});
router.post('/dongtien/update', function(req, res, next){
    req.body.user = req.user;
    dongtien.update(req.body, function(error, data){
        if (error){
            res.json({success: false, data:[], error: error})
        } else{
            res.json({success: true, data: data, error: null});
        }
    });
});
router.post('/dongtien/delete', function(req, res, next){
    dongtien.delete(req.body, function(error, data){
        if (error){
            res.json({success: false, data:[], error: error})
        } else{
            res.json({success: true, data: data, error: null});
        }
    });
});
module.exports = router;