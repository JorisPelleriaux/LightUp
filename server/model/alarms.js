var mongoose = require('mongoose');  
var Schema = mongoose.Schema;


// Define a schema.
var alarmSchema = new Schema({  
  active: Boolean,
  waketime: String,
  duration: String,
  color: String
});

var Alarm = mongoose.model('Alarm', alarmSchema);
module.exports = Alarm;
