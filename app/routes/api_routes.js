var ObjectID = require('mongodb').ObjectID;

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