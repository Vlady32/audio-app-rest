var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  creationDate: {
    type: Date,
    default: Date.now
  },
  login: {
    type: String,
    required: true
  },
  trackID: {
    type: Schema.ObjectId,
    required: true
  }
});

module.exports = mongoose.model('Comment', CommentSchema);
