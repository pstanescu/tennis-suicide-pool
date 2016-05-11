var express = require('express')
var bodyParser = require('body-parser')
//var cookieParser = require('cookie-parser')
var routes = require('./routes/routes')
var http = require('http')
var path = require('path')
var db = require('./config/db')

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var flash = require('connect-flash')
var session = require('express-session')

var app = express()
var engine = require('ejs-locals')

app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static(__dirname + '/public'));
app.engine('ejs',engine)
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')

app.use(session({ secret: 'shhsecret',saveUninitialized: true,resave: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/',routes)

app.use(function(req, res, next){
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    next();
});


require('./config/passport')(passport);

/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});*/

/*var tournamentSchema = mongoose.Schema({
        tournamentNamee: String,
        tournamentYear: Number,
        draws: [
                {drawType: String,
                drawGender: String,
                size: Number,
                rounds: [
                        {roundName: String,
                        seq: Number,
                        matches: [
                                {order:Number,
                                participants: [
                                        {playerName: String,
                                        voters: [
                                                {voterName: String}
                                        ]
                                }]
                        }]
                }]
        }]
});
*/

// Initialize connection
db.connect(function() {
  // Start the application after the database connection is ready
  app.listen(8080,function() {
    console.log('listening on 8080')
  })
});

module.exports = app;
