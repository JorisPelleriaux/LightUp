const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mongoose = require('mongoose'); //mongo connection
var bodyParser = require('body-parser'); //parses information from POST
var methodOverride = require('method-override'); //used to manipulate POST
var Alarm = require('../model/alarms');

// socket io
io.on('connection', function (socket) {
    console.log('user connected')
});

// Connect
var mongoDB = 'mongodb://127.0.0.1/mean';
mongoose.connect(mongoDB, {
  useMongoClient: true
});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// Get all alarms
router.get('/getAlarms', function(req, res, next) {
  var searchQuery = {};

  if(req.query.name)
    searchQuery = { active: req.query.active };

  Alarm.find(searchQuery, function(err, alarms){
    if (err) {
      res.status(400);      
      res.send();
    }

    console.log("returning all the alarms.");
    res.send(alarms);
  })
});

// Insert alarm
router.post('/insertAlarm', function(req, res, next) {
  var newAlarm = new Alarm(req.body);
  newAlarm._id = mongoose.Types.ObjectId();

  newAlarm.save(function(err) {
    if (err) {
      console.log("not saved!");
      res.status(400);
      res.send();
    }

    console.log("saved!");
    res.send({ id : newAlarm._id });
  });
});

//Delete alarm
router.post('/deleteAlarm', function(req, res, next) {
  Alarm.remove({_id : req.body.id}, function(err) {
    if (err) {
      console.log("not removed!");
      res.status(400);      
      res.send();
    }

    console.log("removed!");
    res.send({status: 'ok'});
  });
});

//Update alarm
router.post('/updateAlarm', function(req, res, next) {
  var alarm = new Alarm(req.body);

  Alarm.update({_id : alarm.id}, alarm, function(err) {
    if (err) {
      console.log("not updated!");
      res.status(400);      
      res.send();
    }

    console.log("updated!");
    res.send({status: 'ok'});
  });
});

module.exports = router;
