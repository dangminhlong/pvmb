var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var thanhvien = require('./routes/thanhvien');
var hanhtrinh = require('./routes/hanhtrinh');
var congno = require('./routes/congno');
var nguoidung = require('./routes/nguoidung');
var loaithanhvien = require('./routes/loaithanhvien');
var khuvuc = require('./routes/khuvuc');
var quanlyno = require('./routes/quanlyno');
var sms = require('./routes/sms');
var note = require('./routes/note');
var dongtien = require('./routes/dongtien');
var hangmaybay = require('./routes/hangmaybay');
var cangiare = require('./routes/cangiare');

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function (username, password, done) {
        nguoidungService.findOne(username, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Sai tên.' });
            }
            if (user.matkhau == password)
                return done(null, user.ten);
            else
                return done(null, false, { message: 'Sai mật khẩu.' });
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

// Define a middleware function to be used for every secured routes
var auth = function (req, res, next) {
    if (!req.isAuthenticated())
        res.send(401);
    else
        next();
};

//==================================================================

var app = express();

var NguoiDung = require('./controllers/nguoidung').NguoiDung;
var nguoidungService = new NguoiDung();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'eva',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize()); // Add passport initialization
app.use(passport.session());    // Add passport initialization
app.use(express.static(path.join(__dirname, 'public')));

// any API endpoints
app.post('/login', passport.authenticate('local'), function (req, res, info) {
    res.send(req.user);
});

app.post('/logout', function (req, res) {
    req.logOut();
    res.sendStatus(200);
});

app.post('/isLoggedIn', function (req, res) {
    res.send(req.isAuthenticated() ? req.user : '');
});

app.post('/thanhvien*', auth, thanhvien);
app.post('/hanhtrinh*', auth, hanhtrinh);
app.post('/congno*', auth, congno);
app.post('/nguoidung*', auth, nguoidung);
app.post('/loaithanhvien*', auth, loaithanhvien);
app.post('/khuvuc*', auth, khuvuc);
app.post('/quanlyno*', auth, quanlyno);
app.post('/sms*', auth, sms);
app.post('/note*', auth, note);
app.post('/dongtien*', auth, dongtien);
app.post('/hangmaybay*', auth, hangmaybay);
app.post('/cangiare*', auth, cangiare);
// serve index.html for all remaining routes, in order to leave routing up to angular
app.all("/*", function (req, res, next) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
