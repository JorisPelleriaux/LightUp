module.exports = {
 run: function(Time, Animation) {

//for touch sensor
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var pushButton = new Gpio(23, 'in', 'both'); //use GPIO pin 23 as input, and 'both' button presses, and releases should be handled
var push = 0;  //value of touch sensor
var count = 0;
var loop;
var SnoozeTime = Time || 300000;
var animation = Animation || 'rainbow';
var SelectedAnimation;

const brightness = require('./brightness');
const iterate = require('./iterate');
const rainbow = require('./rainbow');

function unexportOnClose() { //function to run when exiting program
    pushButton.unexport(); // Unexport Button GPIO to free resources
    process.nextTick(function () { process.exit(0); });
};

  // ---- trap the SIGINT and reset before exit
  process.on('SIGINT', unexportOnClose);


switch(animation) {
      case "brightness":
	SelectedAnimation = brightness;
	console.log("start brightness");
        brightness.start();
        break;

      case "iterate":
	SelectedAnimation = iterate;
	console.log("start iterate");
        iterate.start();
        break;

      case "rainbow":
	SelectedAnimation = rainbow;	
	console.log("start rainbow");
        rainbow.start();
        break;

      default:
	SelectedAnimation = rainbow;
	console.log("start default");
        rainbow.start();
}

//watch for interrupt
pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton GPIO, specify callback function
  count+=1;
  if (err) { //if an error
    console.error('There was an error', err); //output error message to console
  return;
  }
  if (value == 1){
    SelectedAnimation.stop();
  }

    if (value == 0){      //check if push was short or long
    if (count <= 80){
      function myFunc(arg) {
        console.log("short push");
        SelectedAnimation.start();
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

}
}
require('make-runnable');

