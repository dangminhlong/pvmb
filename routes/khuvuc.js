var router = require('express').Router();
var KhuVuc = require('../controllers/khuvuc').KhuVuc;

var khuvuc = new KhuVuc();
router.post('/khuvuc', function(req, res, next){    
    khuvuc.findAll(function(error, data){
       res.json(data); 
    });
});
router.post('/khuvuc/new', function(req, res, next){
    khuvuc.addNew(req.body, function(error, data){
        if (error){
            res.json({success: false, data:[], error: error})
        } else{
            res.json({success: true, data: data, error: null});
        }
    });
});
router.post('/khuvuc/update', function(req, res, next){
    khuvuc.update(req.body, function(error, data){
        if (error){
            res.json({success: false, data:[], error: error})
        } else{
            res.json({success: true, data: data, error: null});
        }
    });
});
router.post('/khuvuc/delete', function(req, res, next){
    khuvuc.delete(req.body, function(error, data){
        if (error){
            res.json({success: false, data:[], error: error})
        } else{
            res.json({success: true, data: data, error: null});
        }
    });
});
module.exports = router;