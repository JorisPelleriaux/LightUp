// Global variables
const ws281x = require('../../node_modules/rpi-ws281x-native/lib/ws281x-native');

const NUM_LEDS = 16;
var pixelData = new Uint32Array(NUM_LEDS);
var loop;

module.exports = {
 start: function() {
   ws281x.init(NUM_LEDS);

   // ---- trap the SIGINT and reset before exit
   process.on('SIGINT', unexportOnClose = function () {
     ws281x.reset();
     process.nextTick(function () { process.exit(0); });
   });

  process.removeListener('SIGINT', unexportOnClose);  //remove previous sigint function

   for(var i = 0; i < NUM_LEDS; i++) {
     pixelData[i] = 0xffcc22;
   }
   ws281x.render(pixelData);

   // ---- animation-loop
   var t0 = Date.now();
   loop = setInterval(function () {
     var dt = Date.now() - t0;

     ws281x.setBrightness(Math.floor(Math.sin(dt/1000) * 128 + 128));
   }, 1000 / 30);
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

