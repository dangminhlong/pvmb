var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var config = require('../config');
ToDo = function () {
};

ToDo.prototype.findAll = function (callback) {
    config.opendb().then(function (db) {
        db.collection('todo').find().toArray(function (error, docs) {
            callback(null, docs);
        });
    },
        function (err) {
            callback(err, []);
        });
};

ToDo.prototype.findOne = function (tentodo, callback) {
    config.opendb().then(function (db) {
        db.collection('todo').findOne({ tentodo: tentodo }).then(function (doc) {
            callback(null, doc);
        }, function(error){
            callback(error, null);
        });
    },
        function (err) {
            callback(err, null);
        });
};

ToDo.prototype.addNew = function (doc, callback) {
    config.opendb().then(function (db) {
        db.collection('todo').insertOne(doc).then(function (result) {
            db.collection('todo').find().toArray(function (error, docs) {
                callback(null, docs);
            });
        });
    },
        function (err) {
            callback(err, []);
        });
};

ToDo.prototype.update = function (doc, callback) {
    config.opendb().then(function (db) {
        var id = new ObjectID(doc._id);
        delete doc['_id'];
        db.collection('todo').replaceOne(
            { _id: id },
            doc,
            function (error, results) {
                db.collection('todo').find().toArray(function (error, docs) {
                    callback(error, docs);
                });
            });
    },
        function (err) {
            callback(err, []);
        });
};

ToDo.prototype.delete = function (doc, callback) {
    config.opendb().then(function (db) {
        var id = new ObjectID(doc._id);
        db.collection('todo').deleteOne(
            { _id: id }).then(function (result) {
                db.collection('todo').find().toArray(function (error, docs) {
                    callback(error, docs);
                });
            });
    },
        function (err) {
            callback(err, []);
        });
};

exports.ToDo = ToDo;