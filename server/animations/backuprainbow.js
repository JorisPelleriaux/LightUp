module.exports = {
start: function() {
var loop;
var ws281x = require('../../node_modules/rpi-ws281x-native/lib/ws281x-native');

var NUM_LEDS = 16,
    pixelData = new Uint32Array(NUM_LEDS);

ws281x.init(NUM_LEDS);

//watch for interrupt
pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton GPIO, specify callback function
  count+=1;
  if (err) { //if an error
    console.error('There was an error', err); //output error message to console
  return;
  }
  if (value == 1){
    clearInterval(loop);  //Stop animation
    for (var i = 0; i < NUM_LEDS; i++) {
      pixelData[i] = '0';
    }

    ws281x.render(pixelData);
   }
  if (value == 0){	//check if push was short or long
    if (count <= 80){
      function myFunc(arg) {
        console.log("short push");
        AnimationLoop();
       }
      setTimeout(myFunc, SnoozeTime);

      count = 0;
    }
    if (count > 80){
      console.log("long push");

      count = 0;
    }
  }
});
start: function() {
function unexportOnClose() { //function to run when exiting program
  ws281x.reset();
  process.nextTick(function () { process.exit(0); });
  pushButton.unexport(); // Unexport Button GPIO to free resources
};

// ---- trap the SIGINT and reset before exit
process.on('SIGINT', unexportOnClose);

function AnimationLoop(){
// ---- animation-loop
var offset = 0;
loop =  setInterval(function () {
  for (var i = 0; i < NUM_LEDS; i++) {
    pixelData[i] = colorwheel((offset + i) % 256);
  }

  offset = (offset + 1) % 256;
  ws281x.render(pixelData);
}, 3000 / 30);
}
AnimationLoop();
console.log('Press <ctrl>+C to exit.');


// rainbow-colors, taken from http://goo.gl/Cs3H0v
function colorwheel(pos) {
  pos = 255 - pos;
  if (pos < 85) { return rgb2Int(255 - pos * 3, 0, pos * 3); }
  else if (pos < 170) { pos -= 85; return rgb2Int(0, pos * 3, 255 - pos * 3); }
  else { pos -= 170; return rgb2Int(pos * 3, 255 - pos * 3, 0); }
}

function rgb2Int(r, g, b) {
  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}
}
 stop: function(){
  clearInterval(loop);  //Stop animation
    for (var i = 0; i < NUM_LEDS; i++) {
      pixelData[i] = '0';
    }

    ws281x.render(pixelData);
 }
}

