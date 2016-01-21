var extend = require('extend');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var deferred = require('deferred');
var config = require('../config');

function replaceCongNo(db, id, doc) {
    var def = deferred();
    db.collection('congno').replaceOne(
        { _id: id },
        doc,
        function (error, results) {
            if (error)
                def.reject();
            else
                def.resolve(0);
        });
    return def.promise;
}

function updateDiemVIP(db, id, doc) {
    var def = deferred();
    if (!doc.chodiem && doc.tinhtrangve == 'ĐÃ XUẤT' && doc.ctv) {
        var id_ctv = ObjectID(doc.ctv._id);
        db.collection('thanhvien').findOne({ _id: id_ctv }).then(function (ctv) {
            var diemVIP = 0;
            var diemThuong = 0;
            if (ctv.diemthuong)
                diemThuong = ctv.diemthuong;
            if (ctv.diemVIP)
                diemVIP = ctv.diemVIP + diemThuong;
            else
                diemVIP = diemThuong;
            deferred(
                db.collection('thanhvien').updateOne(
                    { _id: id_ctv },
                    { $set: { diemVIP: diemVIP } }
                    ),
                db.collection('congno').updateOne(
                    { _id: id },
                    { $set: { chodiem: true } }
                    ))(function (results) {
                        def.resolve();
                    }, function (errors) {
                        def.reject();
                    });
        }, function (err) {
            def.reject(err);
        });
    }
    else
        def.resolve();
    return def.promise;
}

function layDsCongNo(db, filter) {
    var defer = deferred();
    db.collection('congno').find(filter).toArray(function (error, docs) {
        if (error)
            defer.reject(error);
        else
            defer.resolve(docs);
    });
    return defer.promise;
}

function layTongCongNo(db, filter) {
    var defer = deferred();
    db.collection('congno').aggregate([
        { $match: filter },
        {
            $group:
            {
                _id: "",
                tongsove: { $sum: 1 },
                tonggiave: { $sum: '$giave' },
                tonggiaban: { $sum: '$giaban' },
                tongckdl: { $sum: '$ckdl' },
                tongckctv: { $sum: '$ckctv' },
                tongphaithu: { $sum: '$phaithu' },
                tongloinhuan: { $sum: '$loinhuan' }
            }
        }], function (error, doc) {
            if (error)
                defer.reject(error);
            else
                defer.resolve(doc);
        });
    return defer.promise;
}

CongNo = function () {
};

CongNo.prototype.importExcel = function (data, callback) {
    config.opendb().then(function (db) {
        db.collection('congno').insertMany(data).then(function (result) {
            db.ensureIndex('congno', { "ngaydatve": 1, "ctv._id": 1, "khachhang": 1, "tinhtrangve": 1, "mave": 1 }, { background: true, w: 1 },
                function (err, indexName) {
                    callback(err, []);
                });
        });
    },
        function (err) {
            callback(err, []);
        });
}

CongNo.prototype.findAll = function (timtheo, tu, den, tinhtrangve, tinhtrangno, hoanve, mave, id_ctv, tenkhach, ghichu, callback) {
    config.opendb().then(function (db) {
        var _tu = new Date(tu);
        var _den = new Date(den);
        var tungay = new Date(_tu.getFullYear(), _tu.getMonth(), _tu.getDate());
        var denngay = new Date(_den.getFullYear(), _den.getMonth(), _den.getDate(), 23, 59, 59);
        var filter = {};
        if (timtheo == 1){
            filter = extend(filter, {ngaydatve: { $gte: tungay, $lte: denngay }});
        } 
        else if (timtheo == 2) 
        {
            filter = extend(filter, {ngayxuatve: { $gte: tungay, $lte: denngay }});
        }
        else {
            filter = extend(filter, {ngaythanhtoan: { $gte: tungay, $lte: denngay }});
        }
        
        if (tinhtrangve && tinhtrangve.length) {
            filter = extend(filter, { tinhtrangve: tinhtrangve });
        }
        else {
            filter = extend(filter, { tinhtrangve: { $ne: 'HỦY' } });
        }
        if (tinhtrangno && tinhtrangno.length)
            filter = extend(filter, { tinhtrangno: tinhtrangno });
        if (mave && mave.length)
            filter = extend(filter, { mave: mave });
        if (tenkhach && tenkhach.length)
            filter = extend(filter, { khachhang: tenkhach });
        if (ghichu && ghichu.length)
            filter = extend(filter, { ghichu: ghichu });
        if (hoanve && hoanve.length)
            filter = extend(filter, { hoanve: hoanve });
        if (id_ctv)
            filter = extend(filter, { "ctv._id": id_ctv });

        deferred(layDsCongNo(db, filter), layTongCongNo(db, filter))(function (values) {
            var dsCongNo = values[0];
            var tong = values[1];
            callback(null, dsCongNo, tong);
        }, function (errors) {
            callback(errors, [], []);
        });
    },
        function (err) {
            callback(err, []);
        });
};

CongNo.prototype.addNew = function (doc, callback) {
    config.opendb().then(function (db) {
        if (doc.ngaybay && doc.ngaybay.length) {
            var ngaybay = new Date(doc.ngaybay);
            delete doc["ngaybay"];
            doc.ngaybay = ngaybay;
        }
        if (doc.ngaydatve && doc.ngaydatve.length) {
            var ngaydatve = new Date(doc.ngaydatve);
            delete doc["ngaydatve"];
            doc.ngaydatve = ngaydatve;
        }
        if (doc.ngayxuatve && doc.ngayxuatve.length) {
            var ngayxuatve = new Date(doc.ngayxuatve);
            delete doc["ngayxuatve"];
            doc.ngayxuatve = ngayxuatve;
        }
        if (doc.ngaythanhtoan && doc.ngaythanhtoan.length) {
            var ngaythanhtoan = new Date(doc.ngaythanhtoan);
            delete doc["ngaythanhtoan"];
            doc.ngaythanhtoan = ngaythanhtoan;
        }
        if (doc.ngayhoanve && doc.ngayhoanve.length) {
            var ngayhoanve = new Date(doc.ngayhoanve);
            delete doc["ngayhoanve"];
            doc.ngayhoanve = ngayhoanve;
        }
        if (doc.ctv && doc.ctv._id){
            var ctv_id = ObjectID(doc.ctv._id);
            delete doc.ctv["_id"];
            doc.ctv._id = ctv_id;
        }
        db.collection('congno').insertOne(doc).then(function (error, result) {
            db.ensureIndex('congno', { "ngaydatve": 1, "ctv._id": 1, "khachhang": 1, "tinhtrangve": 1, "mave": 1 }, { background: true, w: 1 },
                function (err, indexName) {
                    callback(error, []);
                });

        });
    },
        function (err) {
            callback(err, []);
        });
};

CongNo.prototype.update = function (doc, callback) {
    config.opendb().then(function (db) {
        var id = new ObjectID(doc._id);
        delete doc['_id'];
        if (doc.ngaybay && doc.ngaybay.length) {
            var ngaybay = new Date(doc.ngaybay);
            delete doc["ngaybay"];
            doc.ngaybay = ngaybay;
        }
        if (doc.ngaybayve && doc.ngaybayve.length) {
            var ngaybayve = new Date(doc.ngaybayve);
            delete doc["ngaybayve"];
            doc.ngaybayve = ngaybayve;
        }
        if (doc.ngaydatve && doc.ngaydatve.length) {
            var ngaydatve = new Date(doc.ngaydatve);
            delete doc["ngaydatve"];
            doc.ngaydatve = ngaydatve;
        }
        if (doc.ngayxuatve && doc.ngayxuatve.length) {
            var ngayxuatve = new Date(doc.ngayxuatve);
            delete doc["ngayxuatve"];
            doc.ngayxuatve = ngayxuatve;
        }
        if (doc.ngaythanhtoan && doc.ngaythanhtoan.length) {
            var ngaythanhtoan = new Date(doc.ngaythanhtoan);
            delete doc["ngaythanhtoan"];
            doc.ngaythanhtoan = ngaythanhtoan;
        }
        if (doc.ngayhoanve && doc.ngayhoanve.length) {
            var ngayhoanve = new Date(doc.ngayhoanve);
            delete doc["ngayhoanve"];
            doc.ngayhoanve = ngayhoanve;
        }
        if (doc.ctv && doc.ctv._id){
            var ctv_id = ObjectID(doc.ctv._id);
            delete doc.ctv["_id"];
            doc.ctv._id = ctv_id;
        }
        deferred(replaceCongNo(db, id, doc), updateDiemVIP(db, id, doc))(function (results) {
            callback(null, results);
        });
    },
        function (err) {
            callback(err, []);
        });
};

CongNo.prototype.delete = function (doc, callback) {
    config.opendb().then(function (db) {
        var id = new ObjectID(doc._id);
        db.collection('congno').updateOne(
            { _id: id },
            { $set: { "tinhtrang": 0 } },
            function (error, results) {
                callback(error, []);
            });
    },
        function (err) {
            callback(err, []);
        });
};

CongNo.prototype.huy = function (doc, callback) {
    config.opendb().then(function (db) {
        var id = new ObjectID(doc._id);
        db.collection('congno').updateOne(
            { _id: id },
            { $set: { "tinhtrangve": 'HỦY' } },
            function (error, results) {
               callback(error,[]);
            });
        },
        function (err) {
            callback(err, []);
        });
};

CongNo.prototype.thu = function(ngay, callback){
    config.opendb().then(function(db){
        var _tu = new Date(ngay);
        var _den = new Date(ngay);
        var tungay = new Date(_tu.getFullYear(), _tu.getMonth(), _tu.getDate());
        var denngay = new Date(_den.getFullYear(), _den.getMonth(), _den.getDate(), 23, 59, 59);
        var filter = {
            "ngaythanhtoan":{$gte:tungay, $lte:denngay},
            "tinhtrangno":"ĐÃ THANH TOÁN"
        };
        db.collection('congno').aggregate([
        { $match: filter },
        {
            $group:
            {
                _id: "",
                tongthu: { $sum: '$phaithu' }
            }
        }], function (error, docs) {
            if (error)
                callback(error, null);
            else
                callback(null, docs[0]);
        });
    },
    function(err){
        callback(err, null);
    });
};

exports.CongNo = CongNo;