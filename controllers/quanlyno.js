var extend = require('extend');
var ObjectID = require('mongodb').ObjectID;
var config = require('../config');
QuanLyNo = function () {
};

QuanLyNo.prototype.findAll = function (callback) {
    config.opendb().then(function (db) {
        db.collection('no').find().sort({"sotien":-1}).toArray(function (error, docs) {
            callback(null, docs);
        });
    },
        function (err) {
            callback(err, []);
        });
};

QuanLyNo.prototype.findChiTiet = function (ctv_id, callback) {
    config.opendb().then(function (db) {
        db.collection('chitietno').find({"ctv_id": ObjectID(ctv_id)}).toArray(function (error, docs) {
            callback(null, docs);
        });
    },
        function (err) {
            callback(err, []);
        });
};

QuanLyNo.prototype.themno = function (doc, user, callback) {
    config.opendb().then(function (db) {
        var ctv_id = ObjectID(doc.ctv._id);
        db.collection('no').findOne({ "ctv._id": ctv_id }).then(function (no) {
            if (no) {
                var ngay_sua = new Date();
                var sotien = no.sotien + doc.sotien;
                db.collection('no').updateOne({"ctv._id": ctv_id},{$set: {ngay_sua: ngay_sua, sotien: sotien}})
                    .then(function(result){
                        var chitietno = {
                            ctv_id: ctv_id,
                            ngay_ct: new Date(),
                            sotien: doc.sotien,
                            ghichu: doc.ghichu,
                            loai: 1,
                            user: user
                        }
                        db.collection('chitietno').insertOne(chitietno).then(function(result){
                                db.collection('no').find().toArray(function (error, docs) {
                                    callback(null, docs);
                                });
                        });
                    });
            }
            else {
                doc.ngay_tao = new Date();
                doc.ngay_sua = new Date();
                delete doc.ctv["_id"];
                doc.ctv._id = ctv_id;
                db.collection('no').insertOne(doc).then(function (result) {
                    var chitietno = {
                        ctv_id: ctv_id,
                        ngay_ct: new Date(),
                        sotien: doc.sotien,
                        ghichu: doc.ghichu,
                        loai: 1,
                        user: user
                    }
                    db.collection('chitietno').insertOne(chitietno).then(function(result){
                        db.collection('no').find().toArray(function (error, docs) {
                            callback(null, docs);
                        });
                    })
                });
            }
        });
    },
        function (err) {
            callback(err, []);
        });
};

QuanLyNo.prototype.giamno = function (doc, user, callback) {
    config.opendb().then(function (db) {
        var ctv_id = ObjectID(doc.ctv._id);
        db.collection('no').findOne({ "ctv._id": ctv_id }).then(function (no) {
            if (no) {
                var ngay_sua = new Date();
                var sotien = no.sotien - doc.sotien;
                db.collection('no').updateOne({"ctv._id": ctv_id},{$set: {ngay_sua: ngay_sua, sotien: sotien}})
                    .then(function(result){
                        var chitietno = {
                            ctv_id: ctv_id,
                            ngay_ct: new Date(),
                            sotien: -doc.sotien,
                            ghichu: doc.ghichu,
                            loai: 2,
                            user: user
                        }
                        db.collection('chitietno').insertOne(chitietno).then(function(result){
                             db.collection('no').find().toArray(function (error, docs) {
                                callback(null, docs);
                            });
                        });
                    });
            }
            else {
                doc.ngay_tao = new Date();
                doc.ngay_sua = new Date();
                doc.sotien = -doc.sotien;
                db.collection('no').insertOne(doc).then(function (result) {
                    var chitietno = {
                        ctv_id: ctv_id,
                        ngay_ct: new Date(),
                        sotien: -doc.sotien,
                        ghichu: doc.ghichu,
                        loai: 2,
                        user: user
                    }
                    db.collection('chitietno').insertOne(chitietno).then(function(result){
                        db.collection('no').find().toArray(function (error, docs) {
                            callback(null, docs);
                        });
                    })
                });
            }
        });
    },
        function (err) {
            callback(err, []);
        });
};
exports.QuanLyNo = QuanLyNo;