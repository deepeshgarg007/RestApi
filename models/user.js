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
module.exports.getUsers = (callback, limit) => {
	User.find(callback).limit(limit);
}

// Get Single User
module.exports.getUserById = (id, callback) => {
	User.findById(id, callback);
}

// Add User
module.exports.addUser = (user, callback) => {
	User.create(user, callback);
}

// Update user
module.exports.updateUser = (id, user, options, callback) => {
	var query = {_id: id};
	var update = {
		name: user.name,
		tenant: user.tenant,
	}
	User.findOneAndUpdate(query, update, options, callback);
}

// Delete user
module.exports.removeUser = (id, callback) => {
	var query = {_id: id};
	User.remove(query, callback);
}