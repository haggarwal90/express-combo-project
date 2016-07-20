var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./model/db');
var sf = require('./lib/salesforce');
var config = require('./config/config');
var mongoObj = require('./config/monogobjects.json');
var mongodb = require('mongodb');
var databs;

var routes = require('./routes/index');
/*var users = require('./routes/users');*/

var app = express();

//Initialize Mongoose
console.log('config.mongourl '+config.mongourl);
mongodb.MongoClient.connect(config.mongourl, function(error, db){
    if(error) {
       console.log(error);
        //process.exit(1)
    }
    databs = db;
    app.set('database',databs);
    console.log('successfully connected to '+config.mongourl);
});




//Initialize sf
sf.init(config, function (res) {
    console.log('Initialized Sf..');
    app.set('sf', sf);
})

app.set('salesmongoconfig', config);
app.set('mongoObj', mongoObj);

// view engine setup
app.set('views', path.join(__dirname, 'public'));

//app.set('view engine', 'jade');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/angular-route')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/angular')));
app.use('/css', express.static(path.join(__dirname, 'public/stylesheets')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use(express.static(path.join(__dirname, 'public')));
// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//app.use(cookieParser());

app.use('/api', routes);

app.use('*', function (req, res) {
    res.render('index.html');
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
