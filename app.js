const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/database');
const passport = require('passport');
var expressValidator = require('express-validator');
const bcrypt = require('bcryptjs');



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
const accomodate = require('./routes/accomodate');

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use('/users', users);
app.use('/accomodate', accomodate);

app.get('/', (req, res) => {
	res.send('Please use /api/users or /api/tenant');
});

app.listen(3000);
console.log('Running on port 3000...');