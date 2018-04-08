var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {
	// GET request
	app.get('/profileInfo/:id', (req, res) => {
		const id = req.params.id;
    	const details = { '_id': new ObjectID(id) };

		db.collection('profileInfo').findOne(details, (err, item) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				res.send(item);
			}
		});
	});

	app.get('/personalityInfo', (req, res) => {
		const persType = req.params.persType;
		const team = req.params.team;
	   db.collection('personalityInfo').find({team: "A"},{persType:1}).toArray((err, item) => {
		   if (err) {
			   res.send({'error':'An error has occurred'});
		   } else {
			   res.send(item);
		   }
	   });
   });
	
	// POST request for profile info
	app.post('/profileInfo', (req, res) => {
		const info = { 
			name: req.body.name, 
			email: req.body.email,
			phone: req.body.phone
		};
		
		db.collection('profileInfo').insert(info, (err, result) => {
			if (err) { 
				res.send({ 'error': 'An error has occurred' }); 
			} else {
				res.send(result.ops[0]);
			}
		});
	});
	//post for personality info
	app.post('/personalityInfo', (req, res) => {
		const persinfo = { 
			persType: req.body.persType,
			characteristics: req.body.characteristics,
			team: req.body.team 
		};
		
		db.collection('personalityInfo').insert(persinfo, (err, result) => {
			if (err) { 
				res.send({ 'error': 'An error has occurred' }); 
			} else {
				res.send(result.ops[0]);
			}
		});
	});

	// DELETE request
	app.delete('/profileInfo/:id', (req, res) => {
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
	app.put('/profileInfo/:id', (req, res) => {
		const id = req.params.id;
		const details = { '_id': new ObjectID(id) };
		const note = { 
			text: req.body.text, 
			title: req.body.title 
		};

		db.collection('profileInfo').update(details, note, (err, result) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				res.send(note);
			} 
		});
	});
};