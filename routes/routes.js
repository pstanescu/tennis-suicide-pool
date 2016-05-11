var express = require('express');
var passport = require('passport');
var router = express.Router();
var dbConfig = require('../config/db.js');
var ObjectId = require('mongodb').ObjectId;


router.get('/', function(req, res) {
	var db = dbConfig.getDB();
	db.collection('tournaments').find({},{tournamentName:1,tournamentYear:1}).toArray(function(err, result) {
		if(err) return console.log(err);
  	res.render('pages/index',{tournaments:result,user:req.user});
	})
});

router.get('/tournament', isLoggedIn, function(req, res) {
	if (req.params.id) {next()}
	var db = dbConfig.getDB();
	db.collection('tournaments').findOne(
    {"_id": new ObjectId(req.params.id)}, function(err, result) {
      if(err) return console.log(err);
      res.render('pages/tournament',{tournament:result,user:req.user})
		});
})


router.get('/tournament/:id', isLoggedIn, function(req, res) {
	var db = dbConfig.getDB();
	db.collection('tournaments').findOne(
    {"_id": new ObjectId(req.params.id)}, function(err, result) {
      if(err) return console.log(err);
      res.render('pages/tournament',{tournament:result,user:req.user})
		});
})

router.post('/tournaments',isLoggedIn, function(req,res) {
  db.collection('tournaments').save(req.body, function(err,result) {
    if(err) return console.log(err)

    console.log('saved to db')
    res.redirect('/',{user:req.user})
  })
})

router.post('/tournament/vote',isLoggedIn, function(req,res) {
	var db = dbConfig.getDB();
	console.log(req.body.roundIndex)
	var participant = "draws."+req.body.drawIndex+".rounds."+req.body.roundIndex+".matches."+req.body.matchIndex+".participants."+req.body.participantIndex;
	var voter = participant+".voters";
	var playerIndex = req.body.participantIndex+1;
	console.log(voter)
  db.collection('tournaments').findAndModify(
				{"id":new ObjectId(req.body.id),"draws.rounds.seq":req.body.roundIndex,"draws.rounds.matches.order":req.body.matchIndex,"draws.rounds.matches.participants.playerOrder":playerIndex},
				[],
				{$push:{voter:{"voterName":req.user.firstName,"voterEmail":req.user.email}}},
				{"new":true},	function(err,result) {
	    if(err) return console.log(err)
			console.log(result)
			res.redirect('..')
			//res.render('pages/tournament',{tournament:result,user:req.user})


	  })

})

router.get('/profile/:email', isLoggedIn, function(req, res) {
	var db = dbConfig.getDB();
	db.collection('users').findOne(
    {"email": new ObjectId(req.params.email)}, function(err, result) {
      if(err) return console.log(err);
      res.render('profile',{user:req.user})
		});
})


router.get('/login', function(req, res, next) {
  res.render('login.ejs', { message: req.flash('loginMessage') });
});

router.get('/signup', function(req, res) {
  res.render('signup.ejs', { message: req.flash('loginMessage') });
});

router.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile.ejs', { user: req.user });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/error', function(req, res) {
  res.redirect('/error')
})

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}));

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}));

function isLoggedIn(req, res, next) {
	console.log(req.isAuthenticated())
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}

module.exports = router;
