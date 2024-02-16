// Importing the '.env' file for hiding.. sensitive info
require('dotenv').config();

// Boilerplate imports
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Route Import
var indexRouter = require('./routes/index');
var browseRouter =  require('./routes/browse');

// Database import and connection
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGODB_URI;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
  
  //mongoose.connection.close(); //Use this to close the connection when needed as otherwise connection stays on during entire lifecycle of app
}


// Start the app and do required initialization
var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Boilerplate setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes setup
app.use('/', indexRouter);
app.use('/browse', browseRouter);

// Boilerplate catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Boilerplate error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
