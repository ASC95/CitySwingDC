var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const compression = require('compression');
const urls = require('./routes/urls');

//const index = require('./routes/index');
//const users = require('./routes/users');
//const urls = require('./routes/config');
const schedule = require('./routes/schedule');

var app = express();
app.disable('x-powered-by');

//gzip (not needed because github pages automatically gzips)
//app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* User hits this route. This triggers my server to send a request to Facebook
1. Should my request be asynchronous? Yes. The server should render as much of the page as possible and then send
the Facebook data when it's ready
2.
*/

//app.use('/', index);
//app.use('/users', users);

app.get(urls.index, function(req, res) {
  res.render('index', urls);
});

//app.get(urls.schedule, function(req, res) {
//  res.render('schedule', urls);
//});
app.use('/schedule', schedule);

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
var test = require('./routes/test');
app.use('/test', test);
// testing

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
