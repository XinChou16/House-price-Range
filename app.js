var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');

var index = require('./routes/index');
var fddCrawl = require('./routes/fddCrawl');
var szCrawl = require('./routes/szCrawl');
var gzCrawl = require('./routes/gzCrawl');
var ejs = require("ejs");

var app = express();

// 设置模板引擎
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'dist'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));
app.use(session({
  secret: 'fang',
  store: new mongoStore({
    url: 'mongodb://localhost:27017/house-crawl',
    collection: 'sessions',
    resave: false,
    saveUninitialized: true
  })
}))
// app.use(session({
//   cookieName: 'session',
//   secret: '!@#$%^&&*^',
//   duration: 30 * 60 * 1000,
//   activeDuration: 5 * 60 * 1000,
// }));
// 设置主页面路由
app.use('/', index);
app.use('/fangsh', fddCrawl);
app.use('/fangsz', szCrawl);
app.use('/fanggz', gzCrawl);

// 404页面设置
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

// 通过mongoose模块，监听http请求，判断数据库是否连接成功
mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://120.77.204.208:27017/house-crawl',function(err){
  mongoose.connect('mongodb://localhost:27017/house-crawl',function(err){
  if (err) {
    console.log('数据库连接失败')
  }else{
    console.log('数据库连接成功'); 
    app.listen(3000); 
    console.log('Running at port: 3000')
    // 连接到数据库才开始监听 
   
  }
})


module.exports = app;
