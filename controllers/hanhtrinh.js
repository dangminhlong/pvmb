var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var config = require('../config');
HanhTrinh = function () {
};

HanhTrinh.prototype.findAll = function (callback) {
    config.opendb().then(function (db) {
        db.collection('hanhtrinh').find({ tinhtrang: { $ne: 0 } }).toArray(function (error, docs) {
            callback(null, docs);
        });
    },
        function (err) {
            callback(err, []);
        });
};

HanhTrinh.prototype.findByName = function (name, callback) {
    config.opendb().then(function (db) {
        var namePattern = new RegExp(name, 'g');
        db.collection('hanhtrinh').find({ tinhtrang: { $ne: 0 }, ten: { $regex: namePattern } }).toArray(function (error, docs) {
            callback(null, docs);
        });
    },
        function (err) {
            callback(err, []);
        });
};

HanhTrinh.prototype.addNew = function (doc, callback) {
    config.opendb().then(function (db) {
        db.collection('hanhtrinh').insertOne(doc).then(function (result) {
            db.collection('hanhtrinh').find({ tinhtrang: { $ne: 0 } }).toArray(function (error, docs) {
                callback(null, docs);
            });
        });
    },
        function (err) {
            callback(err, []);
        });
};

HanhTrinh.prototype.update = function (doc, callback) {
    config.opendb().then(function (db) {
        var id = new ObjectID(doc._id);
        delete doc['_id'];
        db.collection('hanhtrinh').replaceOne(
            { _id: id },
            doc,
            function (error, results) {
                db.collection('hanhtrinh').find({ tinhtrang: { $ne: 0 } }).toArray(function (error, docs) {
                    callback(error, docs);
                });
            });
    },
        function (err) {
            callback(err, []);
        });

};

HanhTrinh.prototype.delete = function (doc, callback) {
    config.opendb().then(function (db) {
        var id = new ObjectID(doc._id);
        db.collection('hanhtrinh').updateOne(
            { _id: id },
            { $set: { "tinhtrang": 0 } },
            function (error, results) {
                db.collection('hanhtrinh').find({ tinhtrang: { $ne: 0 } }).toArray(function (error, docs) {
                    callback(error, docs);
                });
            });
    },
        function (err) {
            callback(err, []);
        });
};

exports.HanhTrinh = HanhTrinh;