var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config/database');
var port = process.env.PORT || 8080;
var cors = require('cors');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/data'));

app.use(morgan('dev'));
app.use(cors());

mongoose.Promise = global.Promise;
mongoose.connect(config.database);

var apiRoutes = express.Router();

//routing
require('./app/routes')(apiRoutes);

app.use('/api', apiRoutes);

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  morgan.error('Internal error(%d): %s', res.statusCode, err.message);
  res.send({error: err.message});
  next();
});

app.listen(port);
console.log('The server will be available on: http://localhost:' + port);
