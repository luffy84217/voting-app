'use strict';

var path = process.cwd();
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/');
		}
	}

	var pollHandler = new PollHandler();

	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/api/users/isLoggedIn')
		.get(function (req, res) {
			if (req.user) {
				res.json({ isLoggedIn: true });
			} else {
				res.json({ isLoggedIn: false });
			}
		});

	app.route('/api/users/:uid')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user);
		});
		
	app.route('/api/polls/create')
		.post(isLoggedIn, pollHandler.createPoll);
		
	app.route('/api/polls/all')
		.get(pollHandler.getAllPolls);
	
	app.route('/api/polls/:pid')
		.get(pollHandler.getPoll)
		.post(pollHandler.hasVoted, pollHandler.votePoll)
		.delete(isLoggedIn, pollHandler.removePoll);
	
	/*
	app.route('/api/polls/:pid/add')
		.post(pollHandler.addPollOption);
	*/
};
