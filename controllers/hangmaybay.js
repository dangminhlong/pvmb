var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var config = require('../config');
HangMayBay = function () {
};

HangMayBay.prototype.findAll = function (callback) {
    config.opendb().then(function (db) {
        db.collection('hangmaybay').find().toArray(function (error, docs) {
            callback(null, docs);
        });
    },
    function (err) {
        callback(err, []);
    });
};

HangMayBay.prototype.addNew = function (doc, callback) {
    config.opendb().then(function (db) {
        db.collection('hangmaybay').insertOne(doc).then(function (result) {
            db.collection('hangmaybay').find().toArray(function (error, docs) {
                callback(null, docs);
            });
        });
    },
    function (err) {
        callback(err, []);
    });
};

HangMayBay.prototype.update = function (doc, callback) {
    config.opendb().then(function (db) {
        var id = new ObjectID(doc._id);
        delete doc['_id'];
        db.collection('hangmaybay').replaceOne(
            { _id: id },
            doc,
            function (error, results) {
                db.collection('hangmaybay').find().toArray(function (error, docs) {
                    callback(error, docs);
                });
            });
    },
    function (err) {
        callback(err, []);
    });
};

HangMayBay.prototype.delete = function (doc, callback) {
    config.opendb().then(function (db) {
        var id = new ObjectID(doc._id);
        db.collection('hangmaybay').deleteOne(
            { _id: id }).then(function (result) {
                db.collection('hangmaybay').find().toArray(function (error, docs) {
                    callback(error, docs);
                });
            });
    },
    function (err) {
        callback(err, []);
    });
};

exports.HangMayBay = HangMayBay;