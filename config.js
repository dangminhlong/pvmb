var deferred = require('deferred');
var MongoClient = require('mongodb').MongoClient;
var config = {};
config.mongodb = {
    host: "localhost",
    port: "27017",
    db: "pvmb",
    username: "pvmb",
    password: "abc123"
};
config.defer = deferred();
config.opendbstatus = 0;
config.opendb = function () {
    if (config.opendbstatus == 0) {
        var url = 'mongodb://' + config.mongodb.username + ':' + config.mongodb.password + '@' + config.mongodb.host + ':' + config.mongodb.port + '/' + config.mongodb.db;
        MongoClient.connect(url, function (error, db) {
            if (error) {               
                config.defer.reject(error);
            }
            else {
                config.opendbstatus = 1;
                config.defer.resolve(db);
            }
        });
    }
    return config.defer.promise;
}
module.exports = config;