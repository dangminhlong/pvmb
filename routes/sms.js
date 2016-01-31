var router = require('express').Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var xlsx = require('xlsx');
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
router.post('/sms/upload', multipartMiddleware, function (req, res, next) {
    var has_error = false;
    var jsonArray = [];
    for (var i = 0; i < req.files.files.length; i++) {
        var file = req.files.files[i];
        var workbook = xlsx.readFile(file.path);
        var data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        var jsonArray = [];
        data.forEach(function(instance, index, record){
            var item = {
                sodienthoai: record[index].sodienthoai,
                noidung: record[index].noidung
            };
            jsonArray.push(item);
        });
    }
    res.json(jsonArray);
});
module.exports = router;