var router = require('express').Router();
var SMS = require('../controllers/sms').SMS;

var sms = new SMS();
router.post('/sms', function(req, res, next){    
    sms.findAll(function(error, data){
       res.json(data); 
    });
});
router.post('/sms/search', function(req, res, next){    
    sms.search(req.body.ten, req.body.dienthoai, req.body.noidung, function(error, data){
       res.json(data); 
    });
});
router.post('/sms/new', function(req, res, next){
    req.body.user = req.user;
    sms.addNew(req.body, function(error, data){
        if (error){
            res.json({success: false, data:[], error: error})
        } else{
            res.json({success: true, data: data, error: null});
        }
    });
});
router.post('/sms/delete', function(req, res, next){
    sms.delete(req.body, function(error, data){
        if (error){
            res.json({success: false, data:[], error: error})
        } else{
            res.json({success: true, data: data, error: null});
        }
    });
});
module.exports = router;