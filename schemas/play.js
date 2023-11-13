
const mongoose = require('mongoose')
const { Schema } = mongoose
const { ObjectId } = Schema.Types

const playSchema = new Schema({
  name: { type: String, required: true, lowercase: true, trim: true, unique: true},
  plot: { type: String, required: true, lowercase: true, trim: true},
  cast: { type: String, required: true, lowercase: true, trim: true},
  performances: [{show: { type: ObjectId, ref: 'Show' },}]

})


const Play = mongoose.model('Play', playSchema)

module.exports = Play
