var ObjectID = require('mongodb').ObjectID;
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var jwt = require('jsonwebtoken');
var config = require('../../config/config');


module.exports = function(app, db) {

    
    module.exports.getuser = function (req, res) {
		const id = req.params.id;
		const details = { '_id': new ObjectID(id) };
		
		db.collection('userInfo').findOne(details, (err, item) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				res.send(item);
			}
		});
    };
};