var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// Define a schema.
var snoozeSchema = new Schema({
  snoozetime: String,
  snooze: Boolean,
  sensor: Boolean
});

var Snooze = mongoose.model('Snooze', snoozeSchema);
module.exports = Snooze;
