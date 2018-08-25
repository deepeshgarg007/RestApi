const express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

Tenant =require('../models/tenant');

router.get('/', (req, res) => {
	Tenant.getTenants((err, tenant) => {
		if(err){
			throw err;
		}
		res.json(tenant);
	});
});

router.post('/', (req, res) => {
	var tenant = req.body;
	Tenant.addTenant(tenant, (err, tenant) => {
		if(err){
			throw err;
		}
		res.json(tenant);
	});
});

router.delete('/:tenantNo', (req, res) => {
	var no = req.params.tenantNo;
	Tenant.removeTenant(id, (no, tenant) => {
		if(err){
			throw err;
		}
		res.json(tenant);
	});
});

router.put('/:tenantNo', (req, res) => {
	var no = req.params.tenantNo;
	var tenant = req.body;
	Tenant.updateTenant(no, tenant, {}, (err, tenant) => {
		if(err){
			throw err;
		}
		res.json(tenant);
	});
});

module.exports = router;