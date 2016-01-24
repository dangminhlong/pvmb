var router = require('express').Router();
var CanGiaRe = require('../controllers/cangiare').CanGiaRe;

var cangiare = new CanGiaRe();
router.post('/cangiare', function(req, res, next){    
    cangiare.findAll(function(error, data){
       res.json(data); 
    });
});
router.post('/cangiare/new', function(req, res, next){
    cangiare.addNew(req.body, function(error, data){
        if (error){
            res.json({success: false, data:[], error: error})
        } else{
            res.json({success: true, data: data, error: null});
        }
    });
});
router.post('/cangiare/update', function(req, res, next){
    cangiare.update(req.body, function(error, data){
        if (error){
            res.json({success: false, data:[], error: error})
        } else{
            res.json({success: true, data: data, error: null});
        }
    });
});
router.post('/cangiare/delete', function(req, res, next){
    cangiare.delete(req.body, function(error, data){
        if (error){
            res.json({success: false, data:[], error: error})
        } else{
            res.json({success: true, data: data, error: null});
        }
    });
});
module.exports = router;