
const express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');

User =require('../models/user');

router.get('/', (req, res) => {
	User.getUsers((err, users) => {
		if(err){
			throw err;
		}
		res.json(users);
	});
});

router.get('/:name', (req, res) => {
	User.getUserByName(req.params.name, (err, user) => {
		if(err){
			throw err;
		}
		res.json(user);
	});
});

router.post('/', (req, res) => {
	var user = req.body;
	User.addUser(user, (err, user) => {
		if(err){
			throw err;
		}
		res.json(user);
	});
});

router.put('/:name', (req, res) => {
	var name = req.params.name;
	var users = req.body;
	User.updateUser(name, user, {}, (err, user) => {
		if(err){
			throw err;
		}
		res.json(user);
	});
});

router.delete('/name', (req, res) => {
	var name = req.params.name;
	User.removeUser(name, (err, user) => {
		if(err){
			throw err;
		}
		res.json(user);
	});
});

module.exports = router;
