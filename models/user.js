const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


// User Schema
const userSchema = mongoose.Schema({
	name:{
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
});

const User = module.exports = mongoose.model('User', userSchema);

// Get Users
module.exports.getUsers = (callback) => {
	User.find(callback);
}

// Get Single User
module.exports.getUserByName = (username, callback) => {
	var username = {username:username}
	User.findOne(username, callback);
}

// Add User
module.exports.addUser = (newUser, callback) => {
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(newUser.password, salt, (err, hash) => {
		  if(err) throw err;
		  newUser.password = hash;
		  newUser.save(callback);
		});
	});
}


// Update User
module.exports.updateUser = (username, user,options,callback) => {
	var query = {username: username};

	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(user.password, salt, (err, hash) => {
		  if(err) throw err;
		  user.password = hash;
		  var update = {
			name: user.name,
			email: user.email,
			username:user.username,
			password:user.password
		}
		User.findOneAndUpdate(query, update,options,callback);
		});
	});
}

// Delete user
module.exports.removeUser = (username, callback) => {
	var query = {username: username};
	User.remove(query, callback);
}

// Compare Password
module.exports.comparePassword = function(candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
	  if(err) throw err;
	  callback(null, isMatch);
	});
}