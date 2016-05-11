var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs')
var flash = require('connect-flash')
var dbMongo = require('./db.js')


module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.email);
  });
  passport.deserializeUser(function(email, done) {
    var db = dbMongo.getDB();
    db.collection('users').findOne({ 'email': email }, function(err, user) {
        if(err)
          return done(err, user);

        done(null,user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, email, password, done) {
    process.nextTick(function() {
      var db = dbMongo.getDB();

      db.collection('users').findOne({ 'email':  email }, function(err, usr) {
        if (err)
            return done(err);
        if (usr)
          return done(null, false, req.flash('signupMessage', 'That email is already in use.'));
         else {

          var crypto=bcrypt.hashSync(password,bcrypt.genSaltSync(8));
          db.collection('users').insert({'email':email,'password':crypto,"firstName":req.body.firstName, "lastName":req.body.lastName},
            function(err,user){
              if (err)
                return done(err);
              else{
                var ret = user.ops[0]
                return done(null, ret, req.flash('signupMessage', 'Congrats.'));
              }
            })
          }
        })
      })
    })
  );

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, user, password, done) {

    var db = dbMongo.getDB();

    db.collection('users').findOne({ 'email':  user }, function(err, user) {
      if (err)
          return done(err);
      if (!user)
          return done(null, false, req.flash('loginMessage', 'No user found.'));
      if (!bcrypt.compareSync(password, user.password))
              return done(null, false, req.flash('loginMessage', 'Wrong password.'));

      return done(null, user);
    });
  }));
};
