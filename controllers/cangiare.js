var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var config = require('../config');
CanGiaRe = function () {
};

CanGiaRe.prototype.findAll = function (callback) {
    config.opendb().then(function (db) {
        db.collection('cangiare').find().toArray(function (error, docs) {
            callback(null, docs);
        });
    },
        function (err) {
            callback(err, []);
        });
};

CanGiaRe.prototype.addNew = function (doc, callback) {
    config.opendb().then(function (db) {
        db.collection('cangiare').insertOne(doc).then(function (result) {
            db.collection('cangiare').find().toArray(function (error, docs) {
                callback(null, docs);
            });
        });
    },
        function (err) {
            callback(err, []);
        });
};

CanGiaRe.prototype.update = function (doc, callback) {
    config.opendb().then(function (db) {
        var id = new ObjectID(doc._id);
        delete doc['_id'];
        db.collection('cangiare').replaceOne(
            { _id: id },
            doc,
            function (error, results) {
                db.collection('cangiare').find().toArray(function (error, docs) {
                    callback(error, docs);
                });
            });
    },
        function (err) {
            callback(err, []);
        });
};

CanGiaRe.prototype.delete = function (doc, callback) {
    config.opendb().then(function (db) {
        var id = new ObjectID(doc._id);
        db.collection('cangiare').deleteOne(
            { _id: id }).then(function (result) {
                db.collection('cangiare').find().toArray(function (error, docs) {
                    callback(error, docs);
                });
            });
    },
        function (err) {
            callback(err, []);
        });
};

exports.CanGiaRe = CanGiaRe;