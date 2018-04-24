var ObjectID = require('mongodb').ObjectID;
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var jwt = require('jsonwebtoken');
var config = require('../../config/config');

module.exports = function(app, db) {
	// GET request
	app.get('/userInfo/:id', (req, res) => {
		const id = req.params.id;
		const details = { '_id': new ObjectID(id) };
		
		db.collection('userInfo').findOne(details, (err, item) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				res.send(item);
			}
		});
	});
	
	app.get('/userInfo', (req, res) => {
		const persType = req.params.persType;
		const team = req.params.team;
		db.collection('userInfo').find({team: "A"},{persType:1}).toArray((err, item) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				res.send(item);
			}
		});
	});

	app.get('/allTeams', (req, res) => {
		const team = req.params.team;
		db.collection('userInfo').find({},{team:1}).toArray((err, item) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				res.send(item);
			}
		});
	});

	app.get('/allUsers', (req, res) => {
		const name = req.params.name;
		db.collection('userInfo').find({},{name:1}).toArray((err, item) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				res.send(item);
			}
		});
	});

	app.get('/mbtiTest', (req, res) => {
		const question = req.params.qestion;
		const answerA = req.params.answerA;
		const answerB = req.params.answerB;

		db.collection('mbtiTest').find({}).toArray((err, item) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				res.send(item);
			}
		});
	});
	
	app.post('/login', function(req, res) {
		db.collection('userInfo').findOne({username: req.body.username },  function (err, user) {
			if (err) {
				return res.status(500).send('Error on the server.');
			} else if (!user || req.body.password !== user.password) { 
				// in the response we get 200 but auth false, so this way we can display the error message
				res.status(200).send({ auth: false});
			} else {
				var token = jwt.sign({ id: user._id }, config.secret, {
					expiresIn: 86400 // expires in 24 hours
				});
				res.status(200).send({ auth: true, token: token });
			}
		});
	});
	
	// POST request for profile info
	app.post('/userInfo', (req, res) => {
		const info = { 
			username: req.body.username,
			password: req.body.password,
			team: req.body.team, 
			name: req.body.name, 
			email: req.body.email,
			phone: req.body.phone,
			persType: req.body.persType,
			characteristics: req.body.characteristics
		};
		
		db.collection('userInfo').insert(info, (err, result) => {
			if (err) { 
				res.send({ 'error': 'An error has occurred' }); 
			} else {
				res.send(result.ops[0]);
			}
		});
	});

	app.post('/mbtiTest', (req, res) => {
		const info = { 
			question: req.body.question,
			answerA: req.body.answerA,
			answerB: req.body.answerB
		};
		
		db.collection('mbtiTest').insert(info, (err, result) => {
			if (err) { 
				res.send({ 'error': 'An error has occurred' }); 
			} else {
				res.send(result.ops[0]);
			}
		});
	});
	
	// DELETE request
	app.delete('/userInfo/:id', (req, res) => {
		const id = req.params.id;
		const details = { '_id': new ObjectID(id) };
		
		db.collection('profileInfo').remove(details, (err, item) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				res.send('Note ' + id + ' deleted!');
			} 
		});
	});
	
	// PUT request
	app.put('/userInfo/:id', (req, res) => {
		const id = req.params.id;
		const details = { '_id': new ObjectID(id) };
		const note = { 
			text: req.body.text, 
			title: req.body.title 
		};
		
		db.collection('userInfo').update(details, note, (err, result) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				res.send(note);
			} 
		});
	});
};