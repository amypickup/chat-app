/**
* Model for message schema
*/

var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    createdAt: {type: Date, default: Date.now},
    username: {type: String, required: true},
    text: {type: String, required: true}
  }, {
    collection: 'message'  
});

module.exports = mongoose.model('Message', Schema);