var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var config = require('../config');
Note = function () {
};

Note.prototype.get = function (callback) {
    config.opendb().then(
    function (db) {
        db.collection('note').findOne({}).then(function (doc) {
            callback(null, doc);
        }, function(error){
            callback(error, null);
        });
    },
    function (err) {
        callback(err, null);
    });
};

Note.prototype.save = function (note, callback) {
    config.opendb().then(
    function (db) {
        db.collection('note').findOne({}).then(function(doc){
            if (doc){
                db.collection('note').updateOne({},{$set:{noidung:note.noidung}}).then(function(result){
                   callback(null, note); 
                });
            }
            else {
                db.collection('note').insertOne(note).then(function(result){
                    callback(null, note);
                });
            }
        });
    },
    function (err) {
        callback(err, null);
    });
};

exports.Note = Note;