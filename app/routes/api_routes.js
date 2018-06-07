var ObjectID = require('mongodb').ObjectID;
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var jwt = require('jsonwebtoken');
var config = require('../../dbConfig/config');

module.exports = function(app, db) {

		// --- LOGIN PAGE ---
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
				res.status(200).send({ auth: true, token: token, user: req.body.username });
			}
		});
	});
		// --- PROFILE PAGE ---
	app.get('/userInfo/:user', (req, res) => {
		const user = req.params.user;
		const details = { 'username': user };

		db.collection('userInfo').findOne(details, (err, item) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				res.send(item);
			}
		});
	});

//to update user profiles
	app.patch('/update/profile/:user', (req, res) => {
		const user = req.params.user;
		const details = { 'username': user };
		const data = {
			name: req.body.name,
			email: req.body.email,
			phone: req.body.phone,
			persType: req.body.persType,
			characteristics: req.body.characteristics
		};

		db.collection('userInfo').update(details, { $set: { profile : data  } }, (err, result) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				res.send({ success: true, data});
			}
		});
	});

	//used on profile page doGet('mbtiQuestions')
	app.get('/mbtiQuestions', (req, res) => {
		const question = req.params.question;
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

		// --- DASHBOARD PAGE ---

		//used to display all teams for manager view
	app.get('/allTeams', (req, res) => {
		db.collection('userInfo').find({},{team:1}).toArray((err, item) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				res.send(item);
			}
		});
	});

	//used on dasboard to displayed the list of company members
	app.get('/allUsers', (req, res) => {
		// const name = req.params.name;
		db.collection('userInfo').find({},{'profile.name':1, 'username':1}).toArray((err, item) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				res.send(item);
			}
		});
	});
//used on dasboard to populate tha bar chart for manager
	app.get('/allPerstype', (req, res) => {
		const perstype = req.params.perstype;
		db.collection('userInfo').find({},{'profile.persType':1}).toArray((err, item) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				res.send(item);
			}
		});
	});

	// GET  Personality types from a given team for doughnut chart
	app.get('/perstype/:team', (req, res) => {
		const team = req.params.team;
		const details = { 'team': team };
		db.collection('userInfo').find(details,{'profile.name':1, 'profile.persType':1, 'username':1}).toArray((err, item) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				res.send(item);
			}
		});
	});



	// --- POPULATE DATA IN THE DATABASE ---
	//used for adding users
	app.post('/userInfo/create', (req, res) => {
		const info = {
			username: req.body.username,
			password: req.body.password,
			team: req.body.team,
			profile: {
				name: req.body.name,
				email: req.body.email,
				phone: req.body.phone,
				persType: req.body.persType,
				characteristics: req.body.characteristics
			}
		};

		db.collection('userInfo').insert(info, (err, result) => {
			if (err) {
				res.send({ 'error': 'An error has occurred' });
			} else {
				res.send(result.ops[0]);
			}
		});
	});
//used to add MBTI questions
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

// ----- WHERE ARE THESE USED?

//I don't think it's used
	app.get('/userInfo', (req, res) => {
		// const persType = req.params.persType;
		// const team = req.params.team;
		db.collection('userInfo').find({team: "A"},{persType:1}).toArray((err, item) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				res.send(item);
			}
		});
	});

	//where is this used
	app.get('/characteristics/:mbtiType', (req, res) => {
		const mbtiType = req.params.mbtiType;
		db.collection('mbtiCharacteristics').find({persType: new RegExp(mbtiType, 'i')}).toArray((err,item) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				res.send(item);
			}
		});
	});

//where is this used?
	app.post('/mbtiCharacteristics', (req, res) => {
		const info = {
			persType: req.body.persType,
			characteristics: req.body.characteristics,
		};

		db.collection('mbtiCharacteristics').insert(info, (err, result) => {
			if (err) {
				res.send({ 'error': 'An error has occurred' });
			} else {
				res.send(result.ops[0]);
			}
		});
	});

};
