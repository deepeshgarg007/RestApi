
const express = require('express');
var router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const User =require('../models/user');
const Tenant =require('../models/tenant');


router.get('/',passport.authenticate('jwt', {session:false}),(req, res) => {
	User.getUsers((err, users) => {
		if(err){
			throw err;
		}
		res.json(users);
	});
});

// Register
router.post('/register', (req, res, next) => {
    var name =  req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;

    // Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();

    var errors = req.validationErrors();
    
    if(errors){
		res.json({errors:errors});
	} else {
        let newUser = new User ({
            name:name,
            email:email,
            username:username,
            password:password,
        });

        User.getUserByName(username, function(err, user){
            if(err) throw err;
            if(user){
                res.json({success: false, msg: 'Username Already Exists!'});
            }
            else{
                User.addUser(newUser, function(err, user){
                    if(err) throw err;
                    console.log(user)
                });
                res.json({success: true, msg: 'User is registered and can now login'});
            }
        });
    }
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
  
    var errors = req.validationErrors();

    if(errors){
		res.json({errors:errors});
	} else {
        User.getUserByName(username, (err, user) => {
        if(err) throw err;
        if(!user) {
            return res.json({success: false, msg: 'User not found'});
        }
    
        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch) {
            const token = jwt.sign({data: user}, config.secret, {
                expiresIn: 604800 // 1 week
            });
            res.json({
                success: true,
                token: 'JWT '+token,
                user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email
                }
            })
            } else {
            return res.json({success: false, msg: 'Wrong password'});
            }
        });
        });
    }
});

router.get('/:username', passport.authenticate('jwt', {session:false}), (req, res) => {
	User.getUserByName(req.params.username, (err, user) => {
		if(err){
			throw err;
		}
		res.json(user);
	});
});

router.put('/:username', passport.authenticate('jwt', {session:false}), (req, res) => {
	var username = req.params.username;
	var user = req.body;
	User.updateUser(username, user, {  new:true }, (err, user) => {
		if(err){
			throw err;
		}
		res.json(user);
	});
});

router.delete('/:username', passport.authenticate('jwt', {session:false}), (req, res) => {
	var username = req.params.username;
	User.removeUser(username, (err, user) => {
		if(err){
			throw err;
		}
    });
    Tenant.removeTenantByUsername(username, (err, tenant) => {
		if(err){
			throw err;
		}
	});
    res.json({msg:'User deleted successfully'});
});

module.exports = router;
