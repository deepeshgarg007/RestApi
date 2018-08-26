const express = require('express');
var router = express.Router();
const passport = require('passport');
const User = require('../models/user');

const Tenant =require('../models/tenant');

router.get('/', passport.authenticate('jwt', {session:false}), (req, res) => {
	Tenant.getTenants((err, tenant) => {
		if(err){
			throw err;
		}
		res.json(tenant);
	});
});

router.get('/:_tenantNo', passport.authenticate('jwt', {session:false}), (req, res) => {
	Tenant.getUsersByTenantNo((err, tenant) => {
		if(err){
			throw err;
		}
		res.json(tenant);
	});
});

router.post('/', passport.authenticate('jwt', {session:false}), (req, res) => {

	var username = req.body.username;
	var tenantNo = req.body.tenantNo;


    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('tenantNo', 'Tenant Number is required').notEmpty();
  
    var errors = req.validationErrors();

    if(errors){
		res.json({errors:errors});
	} else {
		let newTenant = new Tenant ({
			username:username,
			tenantNo:tenantNo,
		});

		Tenant.countUser(no,(err,count) =>{
		if(count < 3)
		{
			Tenant.assignTenant(newTenant, (err, tenant) => {
				if(err){
					throw err;
				}
				res.json({msg:'Tenant added successfully',tenant});
			});
		}
		else{
			res.send("Tenant bucket "+no+" is full,Please Try Again");
		}
		});
	}
});

router.put('/swap/:username1/:username2',passport.authenticate('jwt', {session:false}), (req, res) => {
	var username1 = req.params.username1;
	var username2 = req.params.username2;

	var tenant1;
	var tenant2;
	var update_tenant1;
	var update_tenant2;
	
	Tenant.getTenantByName(username1,(err,tenant) => {
		if(err){
			throw err;
		}
		tenant1 = tenant;
	});

	Tenant.getTenantByName(username2,(err,tenant) => {
		if(err){
			throw err;
		}
		tenant2 = tenant;
	});

	Tenant.updateTenant(tenant1.username, tenant2, {}, (err, tenant) => {
		if(err){
			throw err;
		}
		update_tenant1 = tenant;
	});

	Tenant.updateTenant(tenant2.username, tenant1, {}, (err, tenant) => {
		if(err){
			throw err;
		}
		update_tenant2 = tenant;
	});

	res.json({msg:'Tenants swapped cuccessfully',update_tenant1,update_tenant2});
});

module.exports = router;