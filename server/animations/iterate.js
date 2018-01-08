// Global variables
const ws281x = require('../../node_modules/rpi-ws281x-native/index.js');

var loop;
const NUM_LEDS = 16;
var pixelData = new Uint32Array(NUM_LEDS);

module.exports = {
 start: function() {
   ws281x.init(NUM_LEDS);

   // ---- trap the SIGINT and reset before exit
   process.on('SIGINT', unexportOnClose = function () {
     ws281x.reset();
     process.nextTick(function () { process.exit(0); });
   });

  process.removeListener('SIGINT', unexportOnClose);  //remove previous sigint function

   // ---- animation-loop
   var offset = 0;
   loop = setInterval(function () {
     var i=NUM_LEDS;
     while(i--) {
         pixelData[i] = 0;
     }
     pixelData[offset] = 0xffffff;

     offset = (offset + 1) % NUM_LEDS;
     ws281x.render(pixelData);
   }, 100);
 },
 stop: function(){
  clearInterval(loop);  //Stop animation
    for (var i = 0; i < NUM_LEDS; i++) {
      pixelData[i] = '0';
    }
    ws281x.render(pixelData);
 }
}
//console.log('Press <ctrl>+C to exit.');
