'use strict';

var Users = require('../models/users');
var Polls = require('../models/polls')

function PollHandler () {

	this.getPoll = function (req, res) {
		Polls
			.findOne({ '_id': req.params.pid })
			.exec(function (err, doc) {
				if (err) {
					res.status(404).end("Error Not Found");
				} else {
					res.json(doc);
				}
			});
	};
	
	this.getAllPolls = function (req, res) {
		Polls
			.find({})
			.exec(function (err, docs) {
				if (err) throw err;
				
				res.json(docs);
			});
	};
	
	this.createPoll = function (req, res) {
		const data = req.body;
		const newPoll = new Polls();
		
		newPoll.title = data.title;
		newPoll.options = data.options.split('\n').reduce((acc, val) => {
			acc.push({ name: val, votes: 0 });
			return acc;
		}, []);
		newPoll.save();
		
		Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, { $push: { ownPolls: newPoll.id } })
			.exec(function (err, doc) {
				if (err) throw err;
				
				console.log(`${req.user.github.id} has made a poll`);
				res.redirect('/');
			});
		
	};
	
	this.removePoll = function (req, res) {
		Polls
			.deleteOne({ '_id': req.params.pid })
			.exec(function (err, doc) {
				if (err) {
					res.status(404).end("Error Not Found");
				} else {
					console.log(`poll ${req.params.pid} has been removed`);
				}
			});
		Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, { $pull: { ownPolls: req.params.pid } })
			.exec(function (err, doc) {
				if (err) {
					res.status(404).end("Error Not Found");
				} else {
					console.log(`${req.user.github.id} didn't have poll anymore`);
				}
			});
			
		res.end();
	};
	
	this.votePoll = function (req, res) {
		const incObj = {};
		incObj['options.' + req.body.selected + '.votes'] = 1;
		
		Polls
			.findOneAndUpdate({ '_id': req.params.pid }, { $inc: incObj })
			.exec(function (err, doc) {
					if (err) {
						res.end("error");
					} else {
						console.log(`option ${req.body.selected} has been voted`);
						
						const vote = req.signedCookies.vote === undefined ?
						[] : req.signedCookies.vote.concat(req.params.pid);
						res.cookie('vote', vote, { maxAge: 1000*60*60*24*365*100, signed: true });
						
						res.redirect('#!/polls/' + req.params.pid);
					}
				}
			);
	};
	
	this.hasVoted = function (req, res, next) {
		if (req.signedCookies.vote) {
			if (req.signedCookies.vote.indexOf(req.params.pid) === -1) {
				next();
			} else {
				res.json({ hasVoted: true });
			}
		} else {
			next();
		}
	};
/*
	this.addPollOption = function (req, res) {
		Polls
			.findOneAndUpdate({ '_id': req.params.pid }, { $push: { 'options': 1 }})
			.exec(function (err, doc) {
					if (err) throw err;

					console.log(doc);
					res.json(doc);
				}
			);
	};
*/
}

module.exports = PollHandler;
