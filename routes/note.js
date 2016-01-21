var router = require('express').Router();
var Note = require('../controllers/note').Note;

var note = new Note();
router.post('/note/get', function(req, res, next){
    note.get(function(error, data){
        if (error){
            res.json(null)
        } else{
            res.json(data);
        }
    });
});
router.post('/note/save', function(req, res, next){
    note.save(req.body, function(error, data){
        if (error){
            res.json({success: false, data:[], error: error})
        } else{
            res.json({success: true, data: data, error: null});
        }
    });
});
module.exports = router;