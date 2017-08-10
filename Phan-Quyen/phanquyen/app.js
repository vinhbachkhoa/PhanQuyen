var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');


/* BODY-PARSER -> DUNG DE LAY DU LIEU MA NGUOI DUNG GUI LEN BANG POST */
var bodyParser = require('body-parser');

/* EXPRESS-SESSION -> DUNG DE LUU TRU SESSION */
var session = require('express-session');
var passport = require('passport');

/* KHAI BAO VA KET NOI MONGODB */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/phanquyen')
    .then(() => console.log('connection successful'))
    .catch((err) => console.error(err));

/* KHAI BAO NOI CHUA CAC ROUTER/API */
var api = require('./routes/api');

/* KHAI BAO TAO UNG DUNG EXPRESS */
var app = express();

/* -- */
app.set('view engine', 'html');
app.set('view engine', 'jade');


/* KHAI BAO CAC HAM KHOI TAO PASSPORT */
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
    secret: "secret",
    saveUninitialized: true,
    resave: true
}))

/* KHAI BAO SU DUNG BODY-PARSER */
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended': 'false' }));
app.use(express.static(path.join(__dirname, 'dist')));

/* KHAI BAO NOI CHUA CAC API */
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;