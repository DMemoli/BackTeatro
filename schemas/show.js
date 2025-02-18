const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')

const { Schema } = mongoose

const showSchema = new Schema({
  date: { type: Date, required: true, trim: true},
  seats: { type: Array, required: true },
  theater_hall: { type: String, required: false },
  price_general: { type: Number, required: true },
  price_platea_baja: { type: Number, required: true },
  price_platea_alta: { type: Number, required: true },

})

const Show = mongoose.model('Show', showSchema)

module.exports = Show
