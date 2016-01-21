var router = require('express').Router();
var HangMayBay = require('../controllers/hangmaybay').HangMayBay;

var hangmaybay = new HangMayBay();
router.post('/hangmaybay', function(req, res, next){    
    hangmaybay.findAll(function(error, data){
       res.json(data); 
    });
});
router.post('/hangmaybay/new', function(req, res, next){
    hangmaybay.addNew(req.body, function(error, data){
        if (error){
            res.json({success: false, data:[], error: error})
        } else{
            res.json({success: true, data: data, error: null});
        }
    });
});
router.post('/hangmaybay/update', function(req, res, next){
    hangmaybay.update(req.body, function(error, data){
        if (error){
            res.json({success: false, data:[], error: error})
        } else{
            res.json({success: true, data: data, error: null});
        }
    });
});
router.post('/hangmaybay/delete', function(req, res, next){
    hangmaybay.delete(req.body, function(error, data){
        if (error){
            res.json({success: false, data:[], error: error})
        } else{
            res.json({success: true, data: data, error: null});
        }
    });
});
module.exports = router;