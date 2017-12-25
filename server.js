const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();

var server = http.createServer(app);
var socketIO = require('socket.io');
var io = socketIO(server);
const ws281x = require('../SmartAlarm/node_modules/rpi-ws281x-native/lib/ws281x-native');

// API file for interacting with MongoDB
const api = require('./server/routes/api');
const alarm = require('./server/model/alarms');

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
