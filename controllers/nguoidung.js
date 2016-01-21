var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var config = require('../config');
NguoiDung = function () {
};

NguoiDung.prototype.findAll = function (callback) {
    config.opendb().then(function (db) {
        db.collection('nguoidung').find().toArray(function (error, docs) {
            callback(null, docs);
        });
    },
        function (err) {
            callback(err, []);
        });
};

NguoiDung.prototype.findOne = function (tennguoidung, callback) {
    config.opendb().then(function (db) {
        db.collection('nguoidung').findOne({ tennguoidung: tennguoidung }).then(function (doc) {
            callback(null, doc);
        },
        function (err) {
            callback(err, null);
        });
    });
};

NguoiDung.prototype.addNew = function (doc, callback) {
    config.opendb().then(function (db) {
        db.collection('nguoidung').insertOne(doc).then(function (result) {
            db.collection('nguoidung').find().toArray(function (error, docs) {
                callback(null, docs);
            });
        });
    },
        function (err) {
            callback(err, []);
        });
};

NguoiDung.prototype.update = function (doc, callback) {
    config.opendb().then(function (db) {
        var id = new ObjectID(doc._id);
        delete doc['_id'];
        db.collection('nguoidung').replaceOne(
            { _id: id },
            doc,
            function (error, results) {
                db.collection('nguoidung').find().toArray(function (error, docs) {
                    callback(error, docs);
                });
            });
    },
        function (err) {
            callback(err, []);
        });
};

NguoiDung.prototype.delete = function (doc, callback) {
    config.opendb().then(function (db) {
        var id = new ObjectID(doc._id);
        db.collection('nguoidung').deleteOne(
            { _id: id }).then(function (result) {
                db.collection('nguoidung').find().toArray(function (error, docs) {
                    callback(error, docs);
                });
            });
    },
        function (err) {
            callback(err, []);
        });
};

exports.NguoiDung = NguoiDung;