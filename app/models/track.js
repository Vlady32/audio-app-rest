var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TrackSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  creationDate: {
    type: Date,
    default: Date.now
  },
  urlImg: {
    type: String,
    required: true
  },
  urlTrack: {
    type: String,
    required: true
  },
  category: Schema.ObjectId,
  countViews: {
    type: Number,
    default: 0
  },
  countLikes: {
    type: Number,
    default: 0
  },
  idsUsersLike: [String]
});

module.exports = mongoose.model('Track', TrackSchema);
