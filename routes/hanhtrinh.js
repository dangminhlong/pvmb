var router = require('express').Router();
var HanhTrinh = require('../controllers/hanhtrinh').HanhTrinh;
var hanhtrinh = new HanhTrinh();
router.post('/hanhtrinh', function(req, res, next){    
    hanhtrinh.findAll(function(error, data){
       res.json(data); 
    });
});
router.post('/hanhtrinh/new', function(req, res, next){
    hanhtrinh.addNew(req.body, function(error, data){
        if (error){
            res.json({success: false, data:[], error: error})
        } else{
            res.json({success: true, data: data, error: null});
        }
    });
});
router.post('/hanhtrinh/update', function(req, res, next){
    hanhtrinh.update(req.body, function(error, data){
        if (error){
            res.json({success: false, data:[], error: error})
        } else{
            res.json({success: true, data: data, error: null});
        }
    });
});
router.post('/hanhtrinh/delete', function(req, res, next){
    hanhtrinh.delete(req.body, function(error, data){
        if (error){
            res.json({success: false, data:[], error: error})
        } else{
            res.json({success: true, data: data, error: null});
        }
    });
});
router.post('/hanhtrinh/findByName', function(req, res, next){
   hanhtrinh.findByName(req.body.name, function(error, data){
       res.json(data);
   } );
});
module.exports = router;