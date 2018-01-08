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
var Snooze = require('../model/snooze');
const ws281x = require('../../node_modules/rpi-ws281x-native/lib/ws281x-native');
var url = "mongodb://localhost:27017/mean";
var res = [];
var cron = require('node-cron');
var myVariables = [];
const controller = require('../animations/Controller');
var SnoozeTime;

//Variables for LedRing
var NUM_LEDS = 16, //Number of leds
pixelData = new Uint32Array(NUM_LEDS);
var ColorString = "0xffcc22";

const options = {
  dma: 5,
  freq: 800000,
  gpio: 12,
  invert: false,
  brightness: 150
};

ws281x.init(NUM_LEDS,options);  //call init function

function LedsOn(){
for(var i = 0; i < NUM_LEDS; i++) {
    pixelData[i] = "0x00ff00";
}
ws281x.render(pixelData);

}


function createTimers(){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    db.collection("snoozes").find({}).toArray(function(err, result) {
      if (err) throw err;
      var data = result[result.length-1].snoozetime.split(':');
      SnoozeTime = (data[0] * 3600000) + (data[1] * 60000);
      db.close();
    });
  });

  myVariables = [];
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.collection("alarms").find({}).toArray(function(err, result) {
    if (err) throw err;
    var i = 0;
    for (var x = 0;x<result.length;x++){
      var data = result[x];
      var name = data._id;
      var color = data.color;
      var active = data.active;  
      var time = data.waketime.split(':')
      var h = parseInt(time[0], 10);
      var m = parseInt(time[1], 10);
	  if (active == true){
	    myVariables[i] = "alarm" +i;
            this[myVariables[i]] = cron.schedule(`${m} ${h} * * *`, function() {
              controller.run(SnoozeTime, color);
            }, true);
	  
            console.log(`${x}'ste alarm om ${h}:${m}, id: ${name}, animatie: ${color} en active: ${active} en naam: ${myVariables[i]}`);
	  i++;  
	}
    }
    db.close();
    });
  })
}

// socket io
io.on('connection', function (socket) {
    console.log('user connected')
    socket.on('DisplayTime', (data) => {
        console.log("echte" + data);
    });

});

function RefreshTimers(){
  //stop crons
  for(i=0;i<myVariables.length;i++){
    console.log('stop '+ myVariables[i]);
    this[myVariables[i]].stop();
  }

  //load alarms from DB and create cron for it
  createTimers();

}

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

  //load alarms from DB and create cron for it
  createTimers();

  if(req.query.active){
    console.log("in zoeken naar "+req.query.active);
    searchQuery = { active: req.query.active };
  }
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

  //start new cron timer
  createTimers();
console.log("insert alarm, id: " + newAlarm._id);

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
  
  RefreshTimers();

console.log("delete alarm, id: " + req.body.id);

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
//load alarms from DB and create cron for it
  createTimers();
});

// Insert snooze setting
router.post('/insertSnoozeSetting', function(req, res, next) {
  var newSnooze = new Snooze(req.body);
  newSnooze._id = mongoose.Types.ObjectId();

  newSnooze.save(function(err) {
    if (err) {
      console.log("not saved!");
      res.status(400);
      res.send();
    }

    console.log("saved!");
    res.send({ id : newSnooze._id });
  });

  RefreshTimers();

  console.log("insert snooze settings, id: " + newSnooze._id);

});

module.exports = router;
