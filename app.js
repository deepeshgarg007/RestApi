const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/database');



mongoose.connect(config.database, { useNewUrlParser: true });
// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to Database '+config.database);
});

// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error '+err);
});

app.use(bodyParser.json());

const users = require('./routes/users');
const tenant = require('./routes/tenant');

app.use('/users', users);
app.use('/tenant', tenant);

app.get('/', (req, res) => {
	res.send('Please use /api/users or /api/tenant');
});

app.listen(3000);
console.log('Running on port 3000...');