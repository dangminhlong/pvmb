var router = require('express').Router();
var ToDo = require('../controllers/todo').ToDo;

var todo = new ToDo();
router.post('/todo', function(req, res, next){    
    todo.findAll(function(error, data){
       res.json(data); 
    });
});
router.post('/todo/new', function(req, res, next){
    todo.addNew(req.body, function(error, data){
        if (error){
            res.json({success: false, data:[], error: error})
        } else{
            res.json({success: true, data: data, error: null});
        }
    });
});
router.post('/todo/update', function(req, res, next){
    todo.update(req.body, function(error, data){
        if (error){
            res.json({success: false, data:[], error: error})
        } else{
            res.json({success: true, data: data, error: null});
        }
    });
});
router.post('/todo/delete', function(req, res, next){
    todo.delete(req.body, function(error, data){
        if (error){
            res.json({success: false, data:[], error: error})
        } else{
            res.json({success: true, data: data, error: null});
        }
    });
});
module.exports = router;