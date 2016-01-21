var extend = require('extend');
var ObjectID = require('mongodb').ObjectID;
var config = require('../config');
ThanhVien = function () {
};

ThanhVien.prototype.findAll = function (callback) {
    config.opendb().then(function (db) {
        db.collection('thanhvien').find({ tinhtrang: { $ne: 0 } }).sort({"khuvuc":1,"diachi":1}).toArray(function (error, docs) {
            callback(null, docs);
        });
    }, function (err) {
        callback(err, []);
    });
};

ThanhVien.prototype.findByName = function (name, callback) {
    config.opendb().then(function (db) {
        var namePattern = new RegExp(name, 'g');
        db.collection('thanhvien').find({ tinhtrang: { $ne: 0 }, ten: { $regex: namePattern } }).toArray(function (error, docs) {
            callback(null, docs);
        });
    }, function (err) {
        callback(err, []);
    });
};

ThanhVien.prototype.search = function (ten, dienthoai, callback) {
    config.opendb().then(function (db) {
        var tenPattern = new RegExp(ten, 'g');
        var dienthoaiPattern = new RegExp(dienthoai, 'g');
        var filter = { tinhtrang: { $ne: 0 }};
        if (ten && ten.length){
            filter = extend(filter, {ten:{$regex: tenPattern}});
        }
        if (dienthoai && dienthoai.length){
            filter = extend(filter, {dienthoai:{$regex: dienthoaiPattern}});
        }
        db.collection('thanhvien').find(filter).toArray(function (error, docs) {
            callback(null, docs);
        });
    }, function (err) {
        callback(err, []);
    });
};

ThanhVien.prototype.addNew = function (doc, callback) {
    config.opendb().then(function (db) {
        db.collection('thanhvien').insertOne(doc).then(function (result) {
            db.ensureIndex('thanhvien', { "ten": 1 }, { background: true, w: 1 }, function (errs, indexName) {
                db.collection('thanhvien').find({ tinhtrang: { $ne: 0 } }).toArray(function (error, docs) {
                    callback(null, docs);
                });

            });
        });
    }, function (err) {
        callback(err, []);
    });
};

ThanhVien.prototype.update = function (doc, callback) {
    config.opendb().then(function (db) {
        var id = new ObjectID(doc._id);
        delete doc['_id'];
        db.collection('thanhvien').replaceOne(
            { _id: id },
            doc,
            function (error, results) {
                db.collection('thanhvien').find({ tinhtrang: { $ne: 0 } }).toArray(function (error, docs) {
                    callback(error, docs);
                });
            });
    }, function (err) {
        callback(err, []);
    });
};

ThanhVien.prototype.delete = function (doc, callback) {
    config.opendb().then(function (db) {
        var id = new ObjectID(doc._id);
        db.collection('thanhvien').updateOne(
            { _id: id },
            { $set: { "tinhtrang": 0 } },
            function (error, results) {
                db.collection('thanhvien').find({ tinhtrang: { $ne: 0 } }).toArray(function (error, docs) {
                    callback(error, docs);
                });
            });
    }, function (err) {
        callback(err, []);
    });
};

exports.ThanhVien = ThanhVien;