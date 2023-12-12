const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')

const { Schema } = mongoose

const showSchema = new Schema({
  date: { type: Date, required: true, lowercase: true, trim: true, unique: true },
  seats: { type: Array, required: true },
  theater_hall: { type: String, required: true }

})

const Show = mongoose.model('Show', showSchema)

module.exports = Show
