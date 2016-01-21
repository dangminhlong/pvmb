var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var config = require('../config');
KhuVuc = function () {
};

KhuVuc.prototype.findAll = function (callback) {
    config.opendb().then(function (db) {
        db.collection('khuvuc').find().toArray(function (error, docs) {
            callback(null, docs);
        });
    },
        function (err) {
            callback(err, []);
        });
};

KhuVuc.prototype.findOne = function (tenkhuvuc, callback) {
    config.opendb().then(function (db) {
        db.collection('khuvuc').find({ tenkhuvuc: tenkhuvuc }).limit(1).toArray(function (error, docs) {
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
        function (err) {
            callback(err, null);
        });
};

KhuVuc.prototype.addNew = function (doc, callback) {
    config.opendb().then(function (db) {
        db.collection('khuvuc').insertOne(doc).then(function (result) {
            db.collection('khuvuc').find().toArray(function (error, docs) {
                callback(null, docs);
            });
        });
    },
        function (err) {
            callback(err, []);
        });
};

KhuVuc.prototype.update = function (doc, callback) {
    config.opendb().then(function (db) {
        var id = new ObjectID(doc._id);
        delete doc['_id'];
        db.collection('khuvuc').replaceOne(
            { _id: id },
            doc,
            function (error, results) {
                db.collection('khuvuc').find().toArray(function (error, docs) {
                    callback(error, docs);
                });
            });
    },
        function (err) {
            callback(err, []);
        });
};

KhuVuc.prototype.delete = function (doc, callback) {
    config.opendb().then(function (db) {
        var id = new ObjectID(doc._id);
        db.collection('khuvuc').deleteOne(
            { _id: id }).then(function (result) {
                db.collection('khuvuc').find().toArray(function (error, docs) {
                    callback(error, docs);
                });
            });
    },
        function (err) {
            callback(err, []);
        });
};

exports.KhuVuc = KhuVuc;