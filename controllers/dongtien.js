var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var config = require('../config');
DongTien = function () {
};

DongTien.prototype.dunodau = function(ngay, callback){
    var _ngay = new Date(ngay);
    _ngay.setHours(0,0,0,0);
    config.opendb().then(function(db){
        db.collection('dongtien').find({"ngay": {$lt: _ngay}}).sort({"ngay":-1})
            .limit(1)
            .toArray(function(error, docs){
                if (error)
                    callback(error, null);
                else {
                    if (docs.length)
                        callback(null, docs[0]);
                    else
                        callback(null, null);
                }
            });
    },
    function(err){
       callback(err, null); 
    });
}

DongTien.prototype.findAll = function (callback) {
    config.opendb().then(function (db) {
        db.collection('dongtien').find().sort({"ngay":-1}).toArray(function (error, docs) {
            callback(null, docs);
        });
    },
        function (err) {
            callback(err, []);
        });
};

DongTien.prototype.addNew = function (doc, callback) {
    config.opendb().then(function (db) {
        var ngay = new Date(doc.ngay);
        doc.ngay = ngay;
        db.collection('dongtien').insertOne(doc).then(function (result) {
            db.collection('dongtien').find().toArray(function (error, docs) {
                callback(null, docs);
            });
        });
    },
        function (err) {
            callback(err, []);
        });
};

DongTien.prototype.update = function (doc, callback) {
    config.opendb().then(function (db) {
        var id = new ObjectID(doc._id);
        delete doc['_id'];
        var ngay = new Date(doc.ngay);
        doc.ngay = ngay;
        db.collection('dongtien').replaceOne(
            { _id: id },
            doc,
            function (error, results) {
                db.collection('dongtien').find().toArray(function (error, docs) {
                    callback(error, docs);
                });
            });
    },
        function (err) {
            callback(err, []);
        });
};

DongTien.prototype.delete = function (doc, callback) {
    config.opendb().then(function (db) {
        var id = new ObjectID(doc._id);
        db.collection('dongtien').deleteOne(
            { _id: id }).then(function (result) {
                db.collection('dongtien').find().toArray(function (error, docs) {
                    callback(error, docs);
                });
            });
    },
        function (err) {
            callback(err, []);
        });
};

exports.DongTien = DongTien;