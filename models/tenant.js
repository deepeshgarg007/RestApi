const mongoose = require('mongoose');

// Tenant Schema
const tenantSchema = mongoose.Schema({
	tenantNo:{
		type: Number,
		required: true
	},
	NOU:{
		type: Number,
		required:true
	}
});

const Tenant = module.exports = mongoose.model('Tenant', tenantSchema);

// Get Tenants
module.exports.getTenants = (callback, limit) => {
	Tenant.find(callback).limit(limit);
}

// Add Tenant
module.exports.addTenant = (tenant, callback) => {
	Tenant.create(tenant, callback);
}

// Update Tenant
module.exports.updateTenant = (no, tenant,callback) => {
	var query = {tenantNo: no};
	var update = {
		NOU: tenant.NOU
	}
	Tenant.findOneAndUpdate(query, update,callback);
}

// Delete Tenant
module.exports.removeTenany = (no, callback) => {
	var query = {tenantNo: no};
	Tenant.remove(query, callback);
}


