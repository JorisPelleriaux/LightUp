const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();
const cron = require('node-cron');
const PythonShell = require('python-shell');

var server = http.createServer(app);
var socketIO = require('socket.io');
var io = socketIO(server);
var mcpadc = require('mcp-spi-adc');
const ws281x = require('../SmartAlarm/node_modules/rpi-ws281x-native/lib/ws281x-native');

var DisplayOff;
var DisplayOn;

// API file for interacting with MongoDB
const api = require('./server/routes/api');
const alarm = require('./server/model/alarms');

//init ADC
var TempSensor = mcpadc.open(0, {speedHz: 20000}, function (err) {
  if (err) throw err;
});
var LightSensor = mcpadc.open(1, {speedHz: 20000}, function (err) {
  if (err) throw err;
});

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

io.on('connection', (socket) => {
    console.log('user connected');

    //watch ADC
    setInterval(function () {
      //Read Temp sensor
      TempSensor.read(function (err, reading) {
        if (err) throw err;
	  var tmp = (reading.value * 3.3 - 0.5) * 100;
          console.log("Temperature: " + tmp);
          socket.emit('temp', tmp); //send temperature to client
        });
      
      //Read Light sensor
      LightSensor.read(function (err, reading) {
        if (err) throw err;
          var lgt = reading.value;
          console.log("Light: " + lgt);
          socket.emit('light', lgt); //send Light value to client
        });	
    }, 10000);

    socket.on('new-message', (message) => {
      console.log(message);
    });
    socket.on('light', (data) => {
     //console.log(data);
      if(data){
	LedsOn(ColorString);   //Turn Leds on
      }
      if(!data){
        LedsOff();   //Turn Leds off
      }
    });
    socket.on('color', (data) => {
        ColorString = data.replace('#','0x');
	console.log(ColorString);
    });

    socket.on('DisplayTimeEnable', (data) => {
      split = data.split(';');
      On = split[0].split(':');
      Off = split[1].split(':');
      
      DisplayOff = cron.schedule(`${Off[1]} ${Off[0]} * * *`, function() {
              PythonShell.run('/server/animations/DisplayOff.py', function (err) {
 		 if (err) throw err;
		 console.log('turn display off');
	      });
            }, true);
    
      DisplayOn = cron.schedule(`${On[1]} ${On[0]} * * *`, function() {
              PythonShell.run('/server/animations/DisplayOn.py', function (err) {
                 if (err) throw err;
                 console.log('turn display on');
              });
            }, true);

    });

    socket.on('DisplayTimeDisable', () => {
      PythonShell.run('/server/animations/DisplayOn.py', function (err) {
         if (err) throw err;
         console.log('turn display on');
      });

      DisplayOff.stop();
      DisplayOn.stop();
    });
});

function LedsOff(){
    for(var i=0; i < NUM_LEDS; i++){
        pixelData[i] = 0;
    }
ws281x.render(pixelData);
}

function LedsOn(Color){
for(var i = 0; i < NUM_LEDS; i++) {
    pixelData[i] = Color;
}
ws281x.render(pixelData);

}

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));

// API location
app.use('/', api);

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);


server.listen(port, () => console.log(`Running on localhost:${port}`));
