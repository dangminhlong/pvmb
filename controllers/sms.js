var MongoClient = require('mongodb').MongoClient;
var extend = require('extend');
var ObjectID = require('mongodb').ObjectID;
var config = require('../config');
SMS = function () {
};

SMS.prototype.findAll = function (callback) {
    config.opendb().then(function (db) {
        db.collection('sms').find().sort({"ngay":-1}).toArray(function (error, docs) {
            callback(null, docs);
        });
    },
        function (err) {
            callback(err, []);
        });
};

SMS.prototype.search = function (ten, dienthoai, noidung, callback) {
    var filter = {};
    
    if (ten && ten.length){
        var tenPattern = new RegExp(ten, 'g');
        filter = extend(filter, {kh:{$regex: tenPattern}});
    }
    if (dienthoai && dienthoai.length){
        var dienthoaiPattern = new RegExp(dienthoai, 'g');
        filter = extend(filter, {dienthoai:{$regex: dienthoaiPattern}});
    }
    if (noidung && noidung.length){
        var noidungPattern = new RegExp(noidung, 'g');
        filter = extend(filter, {noidung:{$regex: noidungPattern}});
    }
    config.opendb().then(function (db) {
        db.collection('sms').find(filter).sort({"ngay":-1}).toArray(function (error, docs) {
            callback(null, docs);
        });
    },
        function (err) {
            callback(err, []);
        });
};

SMS.prototype.addNew = function (doc, callback) {
    config.opendb().then(function (db) {
        db.collection('sms').insertOne(doc).then(function (result) {
            db.collection('sms').find().toArray(function (error, docs) {
                callback(null, docs);
            });
        });
    },
        function (err) {
            callback(err, []);
        });
};

SMS.prototype.delete = function (doc, callback) {
    config.opendb().then(function (db) {
        var id = new ObjectID(doc._id);
        db.collection('sms').deleteOne(
            { _id: id }).then(function (result) {
                db.collection('sms').find().toArray(function (error, docs) {
                    callback(error, docs);
                });
            });
    },
        function (err) {
            callback(err, []);
        });
};

exports.SMS = SMS;