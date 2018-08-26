const mongoose = require('mongoose');

// Tenant Schema
const tenantSchema = mongoose.Schema({
	tenantNo:{
		type: Number,
		required: true
	},
	username:{
		type: String,
		required:true
	}
});

const Tenant = module.exports = mongoose.model('Tenant', tenantSchema);

// Get Tenants
module.exports.getTenants = (callback, limit) => {
	Tenant.find(callback).limit(limit);
}

// Get Single Tenant
module.exports.getTenantByName = (username, callback) => {
	var query = {username:username}
	Tenant.findOne(query, callback);
}

// Add Tenant
module.exports.assignTenant = (tenant, callback) => {
	Tenant.create(tenant, callback);
}

// Update Tenant
module.exports.updateTenant = (username,tenant,callback) => {
	var query = {username : username};
	var update = {
		tenantNo: tenant.tenantNo
	}
	Tenant.findOneAndUpdate(query, update,callback);
}

// Delete Tenant
module.exports.removeTenantByUsername = (username, callback) => {
	var query = {username: username};
	Tenant.remove(query, callback);
}

// Get Users By Tenent
module.exports.getUsersByTenantNo = (tenantNo,callback) => {
	var query = {tenantNo:tenantNo}
	Tenant.find(query,callback);
}

module.exports.countUser = (tenantNo,callback) => {

	var query = {tenantNo:tenantNo};
	Tenant.count(query,callback);
}

