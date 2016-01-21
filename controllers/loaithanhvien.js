var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var config = require('../config');
LoaiThanhVien = function () {
};

LoaiThanhVien.prototype.findAll = function (callback) {
    config.opendb().then(function (db) {
        db.collection('loaithanhvien').find().toArray(function (error, docs) {
            callback(null, docs);
        });
    },
        function (err) {
            callback(err, []);
        });
};

LoaiThanhVien.prototype.findOne = function (tenloaithanhvien, callback) {
    config.opendb().then(function (db) {
        db.collection('loaithanhvien').findOne({ tenloaithanhvien: tenloaithanhvien }).then(function (doc) {
            callback(null, doc);
        }, function(error){
            callback(error, null);
        });
    },
        function (err) {
            callback(err, null);
        });
};

LoaiThanhVien.prototype.addNew = function (doc, callback) {
    config.opendb().then(function (db) {
        db.collection('loaithanhvien').insertOne(doc).then(function (result) {
            db.collection('loaithanhvien').find().toArray(function (error, docs) {
                callback(null, docs);
            });
        });
    },
        function (err) {
            callback(err, []);
        });
};

LoaiThanhVien.prototype.update = function (doc, callback) {
    config.opendb().then(function (db) {
        var id = new ObjectID(doc._id);
        delete doc['_id'];
        db.collection('loaithanhvien').replaceOne(
            { _id: id },
            doc,
            function (error, results) {
                db.collection('loaithanhvien').find().toArray(function (error, docs) {
                    callback(error, docs);
                });
            });
    },
        function (err) {
            callback(err, []);
        });
};

LoaiThanhVien.prototype.delete = function (doc, callback) {
    config.opendb().then(function (db) {
        var id = new ObjectID(doc._id);
        db.collection('loaithanhvien').deleteOne(
            { _id: id }).then(function (result) {
                db.collection('loaithanhvien').find().toArray(function (error, docs) {
                    callback(error, docs);
                });
            });
    },
        function (err) {
            callback(err, []);
        });
};

exports.LoaiThanhVien = LoaiThanhVien;