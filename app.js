'use strict';
// Now I can always do imports relative to the app.js file
global.root_require = function(name) {
  return require(__dirname + '/' + name);
}

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const compression = require('compression');
const urls = require('./server/routes/urls');

const { logger_middleware, logger } = require('./server/logger.js');
//const index = require('./routes/index');
//const users = require('./routes/users');
//const urls = require('./routes/config');
const schedule = require('./server/routes/schedule');

var app = express();
app.disable('x-powered-by');

//gzip (not needed because github pages automatically gzips)
//app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

/*
* Add the morgan logger for development
*/
if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use( 
    morgan(
      'dev', //concise output
      //'common', //more advanced output
      {
        stream: process.stderr
      }
    )
);
}
app.use(logger_middleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/prod'), {redirect: false}));

//app.use('/', index);
//app.use('/users', users);

app.get(urls.index, function(req, res) {
  res.render('index', urls);
});

app.use('/schedule', schedule.router);

app.get(urls.location, function(req, res) {
  res.render('location', urls);
});

app.get(urls.music_and_venue, function(req, res) {
  res.render('music_and_venue', urls);
});

app.get(urls.staff, function(req, res) {
  res.render('staff', urls);
});

app.get(urls.code_of_conduct, function(req, res) {
  res.render('code_of_conduct', urls);
});

app.get(urls.faq, function(req, res) {
  res.render('faq', urls);
});

// testing
// var test = require('./server/routes/test');
// app.use('/test', test);
// testing

/* Catch 404 and forward to error handler
Middleware mounted without a path will run by default on every request
The error handling function doesn't appear to be called without hitting this route first
*/
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/* error handler
'env' defaults to development if not set
*/
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // set the HTTP status
  res.status(err.status || 500);
  // render the error page with the locals as set by res.locals
  res.render('error');
});

module.exports = app;
