const express = require('express');
var router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Tenant =require('../models/tenant');
var Promise = require('promise');

router.get('/', passport.authenticate('jwt', {session:false}), (req, res) => {
	Tenant.getTenants((err, tenant) => {
		if(err){
			throw err;
		}
		res.json(tenant);
	});
});

router.get('/:_tenantNo', passport.authenticate('jwt', {session:false}), (req, res) => {
	Tenant.getUsersByTenantNo(req.params._tenantNo, (err, tenant) => {
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

		Tenant.getTenantByName(username, function(err, tenant){
			if(err) throw err;
            if(tenant){
                res.json({success: false, msg: 'Tenant Already Exists in BucKet '+tenant.tenantNo});
			}
			else{
				Tenant.countUser(tenantNo,(err,count) =>{
				if(count < 20 && tenantNo<5)
				{
					Tenant.assignTenant(newTenant, (err, tenant) => {
						if(err){
							throw err;
						}
						res.json({msg:'Tenant added successfully',tenant});
					});
				}
				else{
					if(tenantNo > 5)
					{
						res.send("Tenant bucket "+tenantNo+" is not a bucket,Please try bucket less than 5");
					}
					else{
					res.send("Tenant bucket "+tenantNo+" is full,Please try another bucket less than 5");
					}
				}
			 });
			}
		});
	}
});

router.put('/swap',passport.authenticate('jwt', {session:false}),(req, res) => {
	var username1 = req.body.username1;
	var username2 = req.body.username2;
	
	Tenant.getTenantByName(username1,(err,tenant1) => {
		if(err){
			throw err;
		}
		if(tenant1){
			Tenant.getTenantByName(username2,(err,tenant2) => {
				if(err){
					throw err;
				}
				if(tenant2){
					Tenant.updateTenant(tenant1.username, tenant2, {  new:true }, (err, updated_tenant1) => {
						if(err){
							throw err;
						}
						if(updated_tenant1){
							Tenant.updateTenant(tenant2.username, tenant1, {  new:true }, (err, updated_tenant2) => {
								if(err){
									throw err;
								}
								console.log(updated_tenant1);
								res.json({msg:'Tenants swapped cuccessfully',updated_tenant1,updated_tenant2});
							});
						}
					});
				}
			});
		}
	});
});

module.exports = router;