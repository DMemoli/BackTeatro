const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')

const { Schema } = mongoose

const ticketSchema = new Schema({
  cliente: { type: ObjectId, ref: 'user', required: true },
  playName: { type: String, required: true, trim: true },
  showId: { type: mongoose.Schema.Types.ObjectId, ref: 'Show'},
  date: { type: Date, required: true, trim: true },
  seats: { type: Array, required: true },
  precio: { type: Number, required: true }
})

const Ticket = mongoose.model('Ticket', ticketSchema)

module.exports = Ticket
