const mongoose = require('mongoose');

// User Schema
const userSchema = mongoose.Schema({
	name:{
		type: String,
		required: true
	},
	tenant:{
		type: Number,
		required: true
	},
	
});

const User = module.exports = mongoose.model('User', userSchema);

// Get Users
module.exports.getUsers = (callback) => {
	User.find(callback);
}

// Get Single User
module.exports.getUserByName = (name, callback) => {
	var name = {name:name}
	User.findOne(name, callback);
}

// Add User
module.exports.addUser = (user, callback) => {
	User.create(user, callback);
}

// Update User
module.exports.updateUser = (name, user, options, callback) => {
	var query = {name: name};
	var update = {
		name: user.name,
		tenant: user.tenant,
	}
	User.findOneAndUpdate(query, update, options, callback);
}

// Delete user
module.exports.removeUser = (name, callback) => {
	var query = {name: name};
	User.remove(query, callback);
}